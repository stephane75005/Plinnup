import Link from 'next/link';

export default function ContinueButton() {
  return (
    <Link href="/slider">
      <button className="btn">
        Continuer
      </button>
    </Link>
  );
}
