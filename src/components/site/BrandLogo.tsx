import logo from '@/assets/exaciv-logo.png.asset.json';

export function BrandLogo({ className = "" }: { className?: string }) {
  return <img src={logo.url} alt="ExaCiv" width={1696} height={593} className={`brand-logo ${className}`} />;
}
