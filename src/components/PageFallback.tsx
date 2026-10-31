/** 路由懒加载时的占位：保持高度，避免布局跳动。 */
export default function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>正在加载页面…</span>
    </div>
  );
}
