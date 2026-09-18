/**
 * 待放置的公共资产清单。
 *
 * 背景：项目详情页的展示图片与相关文档路径已按约定预留，但文件由本人后续本地放入
 * public/ 对应目录。在文件到位之前，如果校验脚本按「引用的本地资产必须存在」直接报错，
 * npm run verify 会一直失败。
 *
 * 因此这里显式声明「已预留、尚未放入」的资产：
 * - 校验脚本对清单内路径**跳过存在性检查**，并输出一条 notice 提醒；
 * - 文件一旦放入，notice 自动消失；
 * - 未在清单内的路径仍然会因缺失而直接判失败，避免真正的断链被放过。
 *
 * 新增预留资产时必须同步登记到本文件。
 */

/** 项目展示图片目录（按项目分目录） */
export const PENDING_PROJECT_IMAGE_PREFIX = "/images/projects/";

/** 「关于我」实践经历配图目录 */
export const PENDING_ABOUT_IMAGE_PREFIX = "/images/about/";

/** 项目相关文档目录 */
export const PENDING_PROJECT_DOC_PREFIX = "/docs/";

/** 判断某个 public 相对路径是否为已登记的「待放置」资产 */
export function isDeclaredPendingAsset(publicPath) {
  return (
    publicPath.startsWith(PENDING_PROJECT_IMAGE_PREFIX) ||
    publicPath.startsWith(PENDING_ABOUT_IMAGE_PREFIX) ||
    publicPath.startsWith(PENDING_PROJECT_DOC_PREFIX)
  );
}
