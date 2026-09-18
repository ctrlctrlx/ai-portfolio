"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, FileImage, X } from "lucide-react";
import type { Locale } from "@/src/lib/i18n";

/** 图库只依赖这一组字段，项目展示与实践经历配图共用 */
interface GalleryImage {
  id: string;
  src: string;
  caption: { zh: string; en: string };
  alt: { zh: string; en: string };
}

/**
 * 通用「图片网格 + 灯箱」板块，供项目展示与实践经历配图共用。
 *
 * - 多张图片自适应换行：移动端单列，sm 起两列，lg 起三列。
 * - 图片全部懒加载（loading="lazy"），滚动到可视区域才请求。
 * - 点击任意图片打开灯箱，支持关闭按钮、左右切换、键盘 Esc / ← / →。
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
  lightboxLabel?: { zh: string; en: string };
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedSrc, setFailedSrc] = useState<Record<string, boolean>>({});

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length
    );
  }, [images.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length
    );
  }, [images.length]);

  // 灯箱打开时监听键盘，并锁定页面滚动
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, showPrevious, showNext]);

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
              onClick={() => setActiveIndex(index)}
              className="group block w-full overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:border-[var(--accent)] hover:shadow-lg motion-reduce:transition-none"
              style={{
                background: "var(--card)",
                borderColor: "var(--card-border)",
              }}
              aria-label={
                locale === "zh"
                  ? `放大查看：${image.caption.zh}`
                  : `Enlarge: ${image.caption.en}`
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
                    alt={image.alt[locale]}
                    width={800}
                    height={600}
                    loading="lazy"
                    unoptimized
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
                {image.caption[locale]}
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
            lightboxLabel
              ? lightboxLabel[locale]
              : locale === "zh"
                ? "图片预览"
                : "Image preview"
          }
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 p-4"
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
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              {failedSrc[activeImage.src] ? (
                <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm text-white/80">
                  {locale === "zh" ? "图片待放入：" : "Image pending at: "}
                  <span className="ml-1 break-all font-mono">{activeImage.src}</span>
                </div>
              ) : (
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt[locale]}
                  width={1600}
                  height={1200}
                  unoptimized
                  className="h-auto max-h-[70vh] w-full object-contain"
                />
              )}
            </div>

            <p className="mt-4 max-w-3xl text-center text-sm leading-6 text-white/90">
              {activeImage.caption[locale]}
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
