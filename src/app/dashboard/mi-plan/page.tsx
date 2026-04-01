import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { generateAccountSnapshot } from '@/lib/skills/account-snapshot';
import { generateRoadmap } from '@/lib/skills/roadmap-generator';
import type { AccountSnapshot, Roadmap } from '@/types/skill';

import SnapshotCard from '@/components/client-panel/SnapshotCard/SnapshotCard';
import RoadmapView from '@/components/client-panel/RoadmapView/RoadmapView';
import HealthMeter from '@/components/client-panel/HealthMeter/HealthMeter';

import styles from './MiPlan.module.css';

export default async function MiPlanPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Buscar account
  const { data: account } = await supabase
    .from('accounts')
    .select('id, agency_name, tier')
    .eq('user_id', user.id)
    .single();

  if (!account) return <div>No se encontró la cuenta. Contacta a soporte.</div>;

  // Leer skill_outputs
  const { data: outputs } = await supabase
    .from('skill_outputs')
    .select('skill_name, payload')
    .eq('account_id', account.id)
    .in('skill_name', ['account-snapshot', 'roadmap-generator'])
    .order('created_at', { ascending: false });

  let snapshot = outputs?.find(o => o.skill_name === 'account-snapshot')?.payload as AccountSnapshot;
  let roadmap = outputs?.find(o => o.skill_name === 'roadmap-generator')?.payload as Roadmap;

  // Generación automática si faltan
  if (!snapshot) {
    console.log('Generating missing snapshot for account', account.id);
    snapshot = await generateAccountSnapshot(account.id);
  }

  if (!roadmap) {
    console.log('Generating missing roadmap for account', account.id);
    roadmap = await generateRoadmap(account.id);
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Tu Plan — {account.agency_name || 'Agencia'}</h1>
          <p className={styles.subtitle}>// diagnóstico · roadmap · playbooks</p>
        </div>
        <div className={styles.tierArea}>
          <span className={styles.tierBadge}>Tier {account.tier.toUpperCase()}</span>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.leftCol}>
          <SnapshotCard snapshot={snapshot} />
          <HealthMeter nivel_salud={snapshot.nivel_salud} />
        </div>
        <div className={styles.rightCol}>
          <RoadmapView roadmap={roadmap} />
        </div>
      </div>
    </div>
  );
}
