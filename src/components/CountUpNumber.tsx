import { useCountUp } from '../hooks/useCountUp';

/** 有真实来源的统计数字才使用计数动画。 */
export default function CountUpNumber({ value, active }: { value: number; active: boolean }) {
  const current = useCountUp(value, active);
  return <>{current.toLocaleString('en-US')}</>;
}
