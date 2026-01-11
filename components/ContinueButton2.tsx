import Link from 'next/link';

export default function ContinueButton() {
  return (
    <Link href="/login">
      <button className="btn">
        Continuer
      </button>
    </Link>
  );
}
