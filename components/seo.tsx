import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

export default function SEO({
  title = 'AI Prompt Glossary - Discover Effective Prompts for AI Tools',
  description = 'A curated collection of effective prompts for working with AI tools like ChatGPT, Claude, and other large language models.',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.jpg',
}: SEOProps) {
  const router = useRouter();
  const fullUrl = canonicalUrl || `https://ai-prompt-glossary.vercel.app${router.asPath}`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://ai-prompt-glossary.vercel.app${ogImage}`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`https://ai-prompt-glossary.vercel.app${ogImage}`} />
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.jpg" />
      <link rel="apple-touch-icon" href="/apple-icon.jpg" />
    </Head>
  );
}
