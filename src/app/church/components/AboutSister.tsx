"use client";

import { useFetchAboutSister } from '@/app/components/Church/useFetchChurch';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import SisterCard from '@/app/components/Church/SisterCard';

export default function AboutSister() {
  const { sisters, loading } = useFetchAboutSister();
  
  if (loading) return <LoadingSpinner />

  return (  
    <SisterCard sisters={sisters}/>
  );
}