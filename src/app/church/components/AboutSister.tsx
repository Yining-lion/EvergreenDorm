"use client";

import { useFetchAboutSister } from '@/app/components/Church/useFetchChurch';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import SisterCard from '@/app/components/Church/SisterCard';
import FadeInSection from '@/app/components/FadeInSection';

export default function AboutSister() {
  const { sisters, loading } = useFetchAboutSister();
  
  if (loading) return <LoadingSpinner />

  return (  
    <FadeInSection delay={0}>
      <SisterCard sisters={sisters}/>
    </FadeInSection>
  );
}