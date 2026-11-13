import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { getContent } from '@/content/loader';
import { createInitialState } from '@/features/experience/controller';
import { viewEvidence } from '@/features/experience/evidence';
import { ReadExperience } from '@/features/read/ReadExperience';
import { ArchitectureExplorer } from '@/features/architecture/ArchitectureExplorer';
import { Recap } from '@/features/ascent/Recap';
import { ReliefCatalog } from '@/features/reliefs/ReliefCatalog';
import { Timeline } from '@/features/time-machine/Timeline';
import { RealmNavigation } from '@/features/ascent/RealmNavigation';
import { ChapterNav } from './ChapterNav';
import { EvidenceBadge } from './EvidenceBadge';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const pack = getContent();

async function expectNoAxeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    // jsdom has no layout engine, so colour contrast is checked in Playwright instead.
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

describe('ChapterNav', () => {
  it('marks the current step, links every chapter and dispatches navigation', async () => {
    const dispatch = vi.fn();
    const state = { ...createInitialState('en'), chapter: 'centuries' as const };
    const { container } = render(
      <ChapterNav pack={pack} locale="en" state={state} dispatch={dispatch} />,
    );
    const nav = screen.getByRole('navigation', { name: 'Chapters' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(links.filter((l) => l.getAttribute('aria-current') === 'step')).toHaveLength(1);
    expect(links[4]).toHaveAttribute('href', '/en/experience?chapter=ascent');

    await userEvent.click(screen.getByRole('button', { name: 'Next: Inside the Monument' }));
    await userEvent.click(screen.getByRole('button', { name: 'Back: The Awakening' }));
    await userEvent.click(links[4]!);
    expect(dispatch.mock.calls.map(([action]) => action.chapter)).toEqual([
      'architecture',
      'awakening',
      'ascent',
    ]);
    await expectNoAxeViolations(container);
  });

  it('disables Back on the first chapter and Next on the last', () => {
    const { rerender } = render(
      <ChapterNav pack={pack} locale="id" state={createInitialState('id')} dispatch={vi.fn()} />,
    );
    expect(screen.getByRole('button', { name: 'Kembali (ini bab pertama)' })).toBeDisabled();
    rerender(
      <ChapterNav
        pack={pack}
        locale="id"
        state={{ ...createInitialState('id'), chapter: 'ascent' }}
        dispatch={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Lanjut (ini bab terakhir)' })).toBeDisabled();
  });
});

describe('Timeline', () => {
  it('exposes four eras with buttons, previous/next and arrow keys', async () => {
    const onChange = vi.fn();
    render(<Timeline pack={pack} value="nineteenth-century" onChange={onChange} locale="en" />);
    const group = screen.getByRole('group', { name: 'Era' });
    const eras = within(group)
      .getAllByRole('button')
      .filter((b) => b.hasAttribute('data-era'));
    expect(eras).toHaveLength(4);
    expect(eras.filter((b) => b.getAttribute('aria-pressed') === 'true')).toHaveLength(1);

    eras[0]!.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.click(screen.getByRole('button', { name: 'Next era' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous era' }));
    expect(onChange.mock.calls.map(([era]) => era)).toEqual([
      'construction',
      'restoration',
      'construction',
      'restoration',
      'construction',
    ]);
  });

  it('labels the statement and the picture separately for every era', () => {
    for (const era of pack.eras) {
      const { unmount } = render(
        <Timeline pack={pack} value={era.id} onChange={vi.fn()} locale="en" />,
      );
      const detail = within(screen.getByTestId('era-detail'));
      expect(detail.getByRole('heading', { level: 2 })).toHaveTextContent(era.label.en);
      expect(detail.getByText('Documented fact')).toBeInTheDocument();
      expect(detail.getByText('Artistic illustration')).toBeInTheDocument();
      expect(detail.getAllByRole('link', { name: /UNESCO/ }).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it('disables previous at the first era and next at the last', () => {
    const { rerender } = render(
      <Timeline pack={pack} value="construction" onChange={vi.fn()} locale="id" />,
    );
    expect(screen.getByRole('button', { name: 'Era sebelumnya' })).toBeDisabled();
    rerender(<Timeline pack={pack} value="present" onChange={vi.fn()} locale="id" />);
    expect(screen.getByRole('button', { name: 'Era berikutnya' })).toBeDisabled();
  });
});

describe('ArchitectureExplorer', () => {
  it('lists every feature as a toggle and shows a sourced description when selected', async () => {
    const onSelect = vi.fn();
    const props = {
      pack,
      locale: 'en' as const,
      onSelect,
      view: '3d' as const,
      onViewChange: vi.fn(),
    };
    const { rerender, container } = render(
      <ArchitectureExplorer {...props} activeFeatureId={null} canShow3d={false} />,
    );
    const items = within(screen.getByRole('list')).getAllByRole('button');
    expect(items).toHaveLength(pack.features.length);
    expect(items.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('button', { name: '3D model' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Diagram' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: '72 openwork stupas' }));
    expect(onSelect).toHaveBeenCalledWith('openwork-stupas');

    rerender(<ArchitectureExplorer {...props} activeFeatureId="openwork-stupas" canShow3d />);
    const detail = within(screen.getByTestId('feature-detail'));
    expect(detail.getByText(/UNESCO describes 72 openwork stupas/)).toBeInTheDocument();
    expect(detail.getByRole('link', { name: /UNESCO/ })).toHaveAttribute(
      'href',
      'https://whc.unesco.org/en/list/592/',
    );
    await userEvent.click(screen.getByRole('button', { name: '72 openwork stupas' }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
    await expectNoAxeViolations(container);
  });
});

describe('RealmNavigation', () => {
  it('lists the three realms from content, base first, with step controls', async () => {
    const onChange = vi.fn();
    render(
      <RealmNavigation realms={pack.realms} value="rupadhatu" onChange={onChange} locale="id" />,
    );
    const buttons = within(screen.getByRole('group', { name: 'Alam' })).getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual([
      expect.stringContaining('Kamadhatu'),
      expect.stringContaining('Rupadhatu'),
      expect.stringContaining('Arupadhatu'),
    ]);
    await userEvent.click(buttons[2]!);
    await userEvent.click(screen.getByRole('button', { name: /^Naik: Arupadhatu/ }));
    await userEvent.click(screen.getByRole('button', { name: /^Turun: Kamadhatu/ }));
    expect(onChange.mock.calls.map(([realm]) => realm)).toEqual([
      'arupadhatu',
      'arupadhatu',
      'kamadhatu',
    ]);
  });

  it('disables Down at the base and Up at the top', () => {
    const { rerender } = render(
      <RealmNavigation realms={pack.realms} value="kamadhatu" onChange={vi.fn()} locale="en" />,
    );
    expect(screen.getByRole('button', { name: 'Down (this is the lowest zone)' })).toBeDisabled();
    rerender(
      <RealmNavigation realms={pack.realms} value="arupadhatu" onChange={vi.fn()} locale="en" />,
    );
    expect(screen.getByRole('button', { name: 'Up (this is the highest zone)' })).toBeDisabled();
  });
});

describe('ReliefCatalog and Recap', () => {
  it('offers one labelled open button per demo story', async () => {
    const onOpen = vi.fn();
    render(<ReliefCatalog pack={pack} locale="en" onOpen={onOpen} />);
    expect(screen.getAllByText('DEMO ARTWORK — NOT ORIGINAL RELIEF')).toHaveLength(
      pack.reliefs.length,
    );
    await userEvent.click(screen.getByRole('button', { name: /^Open story 2: / }));
    expect(onOpen).toHaveBeenCalledWith('demo-panel-02');
  });

  it('recaps every chapter statement with a source link', () => {
    render(<Recap pack={pack} locale="en" />);
    const recap = within(screen.getByTestId('recap'));
    const cited = new Set(pack.chapters.flatMap((chapter) => chapter.claimIds));
    expect(
      recap.getAllByRole('listitem').filter((li) => li.hasAttribute('data-claim')),
    ).toHaveLength(cited.size);
    expect(recap.getAllByRole('link', { name: /UNESCO/ })).toHaveLength(cited.size);
  });
});

describe('EvidenceBadge', () => {
  it('always carries a text label, in both languages', () => {
    render(
      <>
        <EvidenceBadge status="documented" locale="en" />
        <EvidenceBadge status="artistic" locale="id" />
      </>,
    );
    expect(screen.getByText('Documented fact')).toBeInTheDocument();
    expect(screen.getByText('Ilustrasi artistik')).toBeInTheDocument();
  });
});

describe('viewEvidence', () => {
  it('adds era, realm and relief evidence to the chapter claims', () => {
    const ids = (chapter: 'centuries' | 'ascent' | 'stories') =>
      viewEvidence(pack, { chapter, era: 'present', realm: 'kamadhatu' });
    expect(ids('centuries').claims.map((c) => c.id)).toContain('architectural-levels');
    expect(
      viewEvidence(pack, {
        chapter: 'architecture',
        era: 'present',
        realm: 'kamadhatu',
      }).claims.map((c) => c.id),
    ).toContain('cosmological-realms');
    expect(ids('ascent').claims.map((c) => c.id)).toContain('cosmological-realms');
    expect(ids('stories').claims).toEqual([]);
    expect(ids('stories').media.map((m) => m.id)).toContain('relief-demo-line-art');
  });
});

describe.each(['en', 'id'] as const)('ReadExperience (%s)', (locale) => {
  it('renders all five chapters with one h1, cited claims and demo notices', async () => {
    const { container } = render(<ReadExperience pack={pack} locale={locale} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6);
    for (const chapter of pack.chapters)
      expect(container.querySelector(`#chapter-${chapter.id}`)).not.toBeNull();
    for (const claim of pack.claims)
      expect(screen.getAllByText(claim.text[locale]).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('link', { name: /UNESCO World Heritage Centre/ }).length,
    ).toBeGreaterThan(5);
    expect(screen.getAllByTestId('relief-demo-banner')).toHaveLength(pack.reliefs.length);
    for (const feature of pack.features)
      expect(container.querySelector(`#feature-${feature.id}`)).not.toBeNull();
    await expectNoAxeViolations(container);
  });
});
