import type { Verification } from '../data/types';

/**
 * 核验徽章：按业主要求，页面不再展示「已核验 / 待核验 / 示例」这类状态标注。
 * 组件保留为空实现，数据里的 verification 字段仍然保留，需要时改回下面的渲染即可。
 */
export default function VerificationBadge(_props: { status: Verification; compact?: boolean }) {
  return null;
}
