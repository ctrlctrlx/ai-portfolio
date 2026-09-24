"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileImage, X } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

/** 灯箱缩放范围：1 倍（适配窗口）～ 4 倍 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

/** 双指间距，用于换算捏合缩放比例 */
function touchDistance(touches: React.TouchList) {
  const first = touches[0];
  const second = touches[1];
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

/**
 * 图库只依赖这一组字段，项目展示与实践经历配图共用。
 *
 * caption / alt 由调用方（服务端组件）按当前 locale 解析为纯字符串后再传入：
 * 本组件是客户端组件，若直接接收 BilingualText 对象，React 会把中英两套文本
 * 一并序列化进 RSC payload，使英文页面的 HTML 源码里残留中文字符。
 */
interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  alt: string;
}

/**
 * 通用「图片网格 + 灯箱」板块，供项目展示与实践经历配图共用。
 *
 * - 多张图片自适应换行：移动端单列，sm 起两列，lg 起三列。
 * - 图片全部懒加载（loading="lazy"），滚动到可视区域才请求。
 * - 由 next/image 自动输出 AVIF / WebP 并按 sizes 生成响应式 srcset，减少传输体积。
 * - 点击任意图片打开灯箱，支持关闭按钮、左右切换、键盘 Esc / ← / →。
 * - 灯箱内支持缩放：桌面端滚轮、移动端双指捏合（1×～4×），
 *   切换图片或关闭灯箱时自动复位；缩放裁剪在图片框内，不会撑大弹窗布局。
 * - 图片路径由 profile 数据层提供，文件放入 public 后自动生效。
 * - 图片缺失时（文件尚未放入）展示占位块并标出预期路径，便于核对。
 *
 * caption 展示在图片下方，字号略小于正文；
 * lightboxLabel 用于灯箱的无障碍名称，可按场景传入。
 */
export default function ImageGallery({
  images,
  locale,
  lightboxLabel,
}: {
  images: GalleryImage[];
  locale: Locale;
  lightboxLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedSrc, setFailedSrc] = useState<Record<string, boolean>>({});
  /** 灯箱内当前缩放倍数 */
  const [zoom, setZoom] = useState(MIN_ZOOM);
  /** 捏合起始状态：起始双指间距与起始倍数 */
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  /** 灯箱容器：打开时接收焦点，并作为 Tab 焦点环的边界 */
  const dialogRef = useRef<HTMLDivElement | null>(null);
  /** 触发灯箱的缩略图按钮：关闭后把焦点归还给它 */
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // 切换图片或关闭灯箱时把缩放复位到 1 倍
  // （直接在事件处理里复位，避免在 effect 中同步 setState 触发级联渲染）
  const close = useCallback(() => {
    setActiveIndex(null);
    setZoom(MIN_ZOOM);
    // 关闭后焦点归还触发元素，键盘用户不会丢失当前位置
    triggerRef.current?.focus();
  }, []);
  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length
    );
    setZoom(MIN_ZOOM);
  }, [images.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length
    );
    setZoom(MIN_ZOOM);
  }, [images.length]);

  // 灯箱打开时把焦点移入对话框（含切换图片），使键盘操作始终从灯箱内开始
  useEffect(() => {
    if (activeIndex === null) return;
    dialogRef.current?.focus();
  }, [activeIndex]);

  // 灯箱打开时监听键盘、锁定页面滚动，并把 Tab 焦点限制在灯箱内部
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();

      // 焦点环：Tab / Shift+Tab 在灯箱内的可聚焦元素之间循环，不逃到页面背景
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => !element.hasAttribute("disabled"));
        if (focusables.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === dialog)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, showPrevious, showNext]);

  // 切换图片或关闭灯箱时把缩放复位到 1 倍
  /**
   * 桌面端滚轮缩放。
   * 灯箱打开时 body 滚动已被上面的 effect 锁定，因此无需 preventDefault
   * （React 的 onWheel 是 passive 监听，调用 preventDefault 也无效）。
   */
  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    setZoom((current) => clampZoom(current - event.deltaY * 0.0015));
  }, []);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length !== 2) return;
      pinchRef.current = { distance: touchDistance(event.touches), zoom };
    },
    [zoom]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const start = pinchRef.current;
      if (event.touches.length !== 2 || !start || start.distance === 0) return;
      const ratio = touchDistance(event.touches) / start.distance;
      setZoom(clampZoom(start.zoom * ratio));
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
  }, []);

  if (images.length === 0) return null;

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const hasMultiple = images.length > 1;

  return (
    <>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveIndex(index);
                setZoom(MIN_ZOOM);
              }}
              className="group block w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg motion-reduce:transition-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
              }}
              aria-label={
                locale === "zh"
                  ? `放大查看：${image.caption}`
                  : `Enlarge: ${image.caption}`
              }
            >
              <span
                className="relative block w-full overflow-hidden"
                style={{ aspectRatio: "4 / 3", background: "var(--background)" }}
              >
                {failedSrc[image.src] ? (
                  <span
                    className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center"
                    style={{ color: "var(--muted)" }}
                  >
                    <FileImage size={22} aria-hidden="true" />
                    <span className="text-xs leading-5">
                      {locale === "zh"
                        ? "图片待放入："
                        : "Image pending at: "}
                      <span className="break-all font-mono">{image.src}</span>
                    </span>
                  </span>
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    /* 画廊图片全部懒加载：滚动到可视区域才请求 */
                    loading="lazy"
                    /* 移动端单列、sm 两列、lg 三列，按实际展示宽度取图 */
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    onError={() =>
                      setFailedSrc((previous) => ({
                        ...previous,
                        [image.src]: true,
                      }))
                    }
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                )}
              </span>
              {/* 图注：字号略小于正文 */}
              <span
                className="block px-4 py-3 text-xs leading-5"
                style={{ color: "var(--muted)" }}
              >
                {image.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* 灯箱 */}
      {activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            lightboxLabel ??
            (locale === "zh" ? "图片预览" : "Image preview")
          }
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 p-4 focus:outline-none"
          onClick={close}
        >
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label={locale === "zh" ? "关闭预览" : "Close preview"}
          >
            <X size={20} aria-hidden="true" />
          </button>

          <div
            className="flex w-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl border"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                /* 由组件自行处理双指捏合，避免浏览器接管手势 */
                touchAction: "none",
              }}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {failedSrc[activeImage.src] ? (
                <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm text-white/80">
                  {locale === "zh" ? "图片待放入：" : "Image pending at: "}
                  <span className="ml-1 break-all font-mono">{activeImage.src}</span>
                </div>
              ) : (
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  width={1600}
                  height={1200}
                  /* 灯箱同样懒加载：打开时才需要更大尺寸的图 */
                  loading="lazy"
                  /* 灯箱最大宽度 max-w-5xl（64rem），小视口下取满宽 */
                  sizes="(min-width: 1088px) 1024px, 100vw"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                  className="h-auto max-h-[70vh] w-full object-contain transition-transform duration-150 motion-reduce:transition-none"
                />
              )}
            </div>

            <p className="mt-4 max-w-3xl text-center text-sm leading-6 text-white/90">
              {activeImage.caption}
            </p>
            <p className="mt-1 text-xs text-white/60">
              {(activeIndex ?? 0) + 1} / {images.length}
            </p>

            {hasMultiple && (
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={showPrevious}
                  className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label={locale === "zh" ? "上一张" : "Previous image"}
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label={locale === "zh" ? "下一张" : "Next image"}
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
