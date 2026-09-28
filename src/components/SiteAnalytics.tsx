"use client";

import { Analytics } from "@vercel/analytics/next";
import type { BeforeSendEvent } from "@vercel/analytics/next";

/**
 * 站长自访过滤：localStorage 中的持久标记键。
 * 值为 "1" 表示「当前浏览器属于站长本人」，其后所有事件一律不上报。
 */
const SELF_EXCLUDE_KEY = "va_self_exclude";

/** URL 查询参数：`?self=1` 标记本机为站长设备，`?self=0` 取消标记 */
const SELF_QUERY_KEY = "self";

/** 读取当前地址栏的 `self` 参数；URL 解析异常时按「无参数」处理，不影响统计 */
function readSelfParam(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URL(window.location.href).searchParams.get(SELF_QUERY_KEY);
  } catch {
    return null;
  }
}

/**
 * 上报前过滤（纯客户端执行，覆盖页面浏览与全部自定义事件）。
 *
 * 1. 非浏览器环境（SSR / 静态预渲染）直接放行，不读写任何浏览器 API；
 * 2. 地址栏带 `?self=1` → 写入 localStorage 持久标记，并取消本次上报；
 *    带 `?self=0` → 清除标记，恢复正常统计；
 * 3. 无参数时读取持久标记：已标记则取消上报，未标记则原样放行；
 * 4. 隐私模式 / 禁用存储（localStorage 抛异常）：不报错，至少保证
 *    本次带 `?self=1` 的访问被过滤。
 *
 * 站长同一浏览器的后续所有访问（页面浏览、简历下载 `resume_download`
 * 以及今后新增的任意事件）都会经过本函数，因此一次标记即长期生效。
 */
function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (typeof window === "undefined") return event;

  const selfParam = readSelfParam();

  try {
    if (selfParam === "1") {
      window.localStorage.setItem(SELF_EXCLUDE_KEY, "1");
    } else if (selfParam === "0") {
      window.localStorage.removeItem(SELF_EXCLUDE_KEY);
    }

    if (selfParam === "1") return null;
    if (window.localStorage.getItem(SELF_EXCLUDE_KEY) === "1") return null;
  } catch {
    if (selfParam === "1") return null;
  }

  return event;
}

/**
 * 全站统计入口（`app/[lang]/layout.tsx` 在 body 内容最底部渲染）。
 *
 * 说明：`beforeSend` 是函数，无法从服务端组件跨 RSC 边界传给客户端组件，
 * 因此这里单独抽出一个客户端组件承载回调，等价于在根布局直接写
 * `<Analytics beforeSend={...} />`；组件本身渲染 `null`，
 * 前端不展示任何统计元素，也不影响 SSG 与首屏体积。
 */
export default function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
