import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FrequentFlyerPortal from '../components/FrequentFlyerPortal';
import { sanitizeInput } from '../utils/sanitizer';

describe('Ticket ENG-163087: Frequent Flyer Portal - Strict TDD Test Suite', () => {
  let consoleSpy;

  beforeEach(() => {
    localStorage.clear();
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. HAPPY PATH (Agile User Stories)
  // =========================================================================
  describe('1. Happy Path & Core Floor Workflows', () => {
    it('renders the portal header with enterprise branding and ticket ID reference', () => {
      render(<FrequentFlyerPortal />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(screen.getByText(/frequent flyer portal/i)).toBeInTheDocument();
      expect(screen.getByText(/ENG-163087/i)).toBeInTheDocument();
    });

    it('renders summary metrics: Total Members, Active Platinum/Gold counts, and Total Miles Logged', () => {
      render(<FrequentFlyerPortal />);

      const metricsRegion = screen.getByRole('region', { name: /summary metrics/i });
      expect(metricsRegion).toBeInTheDocument();

      expect(within(metricsRegion).getByText(/total members/i)).toBeInTheDocument();
      expect(within(metricsRegion).getByText(/platinum members/i)).toBeInTheDocument();
      expect(within(metricsRegion).getByText(/gold members/i)).toBeInTheDocument();
      expect(within(metricsRegion).getByText(/total miles logged/i)).toBeInTheDocument();
    });

    it('renders member data table with all required columns and initial floor roster', () => {
      render(<FrequentFlyerPortal />);

      const table = screen.getByRole('table', { name: /frequent flyer roster/i });
      expect(table).toBeInTheDocument();

      // Verify all domain columns
      expect(screen.getByRole('columnheader', { name: /member id/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /full name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /ff number/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /tier status/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /points balance/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /last flight code/i })).toBeInTheDocument();
    });

    it('filters member roster immediately when floor staff types into search bar', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const searchInput = screen.getByRole('searchbox', { name: /search members/i });
      expect(searchInput).toBeInTheDocument();

      await user.type(searchInput, 'FF-1001');

      const table = screen.getByRole('table', { name: /frequent flyer roster/i });
      expect(within(table).getByText('FF-1001')).toBeInTheDocument();
    });

    it('filters member roster immediately by Tier Status dropdown', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const tierFilter = screen.getByRole('combobox', { name: /filter by tier status/i });
      expect(tierFilter).toBeInTheDocument();

      await user.selectOptions(tierFilter, 'Platinum');

      const rows = screen.getAllByRole('row');
      // Verify rows only show Platinum tiers
      const tierBadges = screen.getAllByTestId('tier-badge');
      tierBadges.forEach((badge) => {
        expect(badge).toHaveTextContent(/platinum/i);
      });
    });

    it('successfully enrolls a new Frequent Flyer member and updates roster and summary metrics', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      const tierSelect = screen.getByRole('combobox', { name: /select tier status/i });
      const milesInput = screen.getByRole('spinbutton', { name: /initial points balance/i });
      const flightCodeInput = screen.getByRole('textbox', { name: /last flight code/i });
      const enrollButton = screen.getByRole('button', { name: /enroll member/i });

      await user.type(nameInput, 'Amelia Earhart');
      await user.type(ffNumberInput, 'FF-9901');
      await user.selectOptions(tierSelect, 'Gold');
      await user.clear(milesInput);
      await user.type(milesInput, '45000');
      await user.type(flightCodeInput, 'BA-2490');

      await user.click(enrollButton);

      await waitFor(() => {
        expect(screen.getByText('Amelia Earhart')).toBeInTheDocument();
        expect(screen.getByText('FF-9901')).toBeInTheDocument();
      });
    });

    it('successfully logs miles to an existing member and reflects updated points balance and total miles', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const memberSelect = screen.getByRole('combobox', { name: /select member for flight log/i });
      const milesToAddInput = screen.getByRole('spinbutton', { name: /miles to add/i });
      const flightInput = screen.getByRole('textbox', { name: /new flight code/i });
      const logMilesButton = screen.getByRole('button', { name: /log flight miles/i });

      await user.selectOptions(memberSelect, 'FF-1001');
      await user.type(milesToAddInput, '5000');
      await user.type(flightInput, 'LH-400');
      await user.click(logMilesButton);

      await waitFor(() => {
        expect(screen.getByText(/miles logged successfully/i)).toBeInTheDocument();
      });
    });

    it('persists data to localStorage to support floor Wi-Fi reconnection/reloads', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<FrequentFlyerPortal />);

      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      const tierSelect = screen.getByRole('combobox', { name: /select tier status/i });
      const milesInput = screen.getByRole('spinbutton', { name: /initial points balance/i });
      const flightCodeInput = screen.getByRole('textbox', { name: /last flight code/i });
      const enrollButton = screen.getByRole('button', { name: /enroll member/i });

      await user.type(nameInput, 'Charles Lindbergh');
      await user.type(ffNumberInput, 'FF-7777');
      await user.selectOptions(tierSelect, 'Platinum');
      await user.clear(milesInput);
      await user.type(milesInput, '85000');
      await user.type(flightCodeInput, 'PA-001');
      await user.click(enrollButton);

      await waitFor(() => {
        expect(screen.getByText('Charles Lindbergh')).toBeInTheDocument();
      });

      // Verify localStorage was updated
      expect(localStorage.getItem('frequent_flyer_roster')).toContain('Charles Lindbergh');

      // Unmount and remount to verify local persistence
      unmount();
      render(<FrequentFlyerPortal />);

      expect(screen.getByText('Charles Lindbergh')).toBeInTheDocument();
      expect(screen.getByText('FF-7777')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. UNHAPPY PATH (Edge Cases & Resilience)
  // =========================================================================
  describe('2. Unhappy Path & Edge Cases', () => {
    it('renders an accessible "No data found" empty state when search matches no members', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const searchInput = screen.getByRole('searchbox', { name: /search members/i });
      await user.type(searchInput, 'NonExistentPassengerQueryXYZ999');

      const emptyState = screen.getByRole('status', { name: /no data found/i });
      expect(emptyState).toBeInTheDocument();
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
      expect(screen.getByText(/no frequent flyer members match your search criteria/i)).toBeInTheDocument();
    });

    it('renders an accessible empty state when the roster is completely empty', () => {
      localStorage.setItem('frequent_flyer_roster', JSON.stringify([]));
      render(<FrequentFlyerPortal />);

      const emptyState = screen.getByRole('status', { name: /no data found/i });
      expect(emptyState).toBeInTheDocument();
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });

    it('displays visible loading indicator with role="status" and aria-busy="true" during network operations', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const networkToggle = screen.getByRole('combobox', { name: /network connectivity simulation/i });
      await user.selectOptions(networkToggle, 'slow-3g');

      const refreshBtn = screen.getByRole('button', { name: /refresh floor data/i });
      await user.click(refreshBtn);

      const loadingIndicator = screen.getByRole('status', { name: /loading floor data/i });
      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
    });

    it('gracefully handles offline state and queues updates without crashing', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const networkToggle = screen.getByRole('combobox', { name: /network connectivity simulation/i });
      await user.selectOptions(networkToggle, 'offline');

      expect(screen.getByText(/offline mode/i)).toBeInTheDocument();

      // Enroll in offline mode
      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      const tierSelect = screen.getByRole('combobox', { name: /select tier status/i });
      const milesInput = screen.getByRole('spinbutton', { name: /initial points balance/i });
      const flightCodeInput = screen.getByRole('textbox', { name: /last flight code/i });
      const enrollButton = screen.getByRole('button', { name: /enroll member/i });

      await user.type(nameInput, 'Offline Passenger');
      await user.type(ffNumberInput, 'FF-4040');
      await user.selectOptions(tierSelect, 'Silver');
      await user.clear(milesInput);
      await user.type(milesInput, '12000');
      await user.type(flightCodeInput, 'DL-909');
      await user.click(enrollButton);

      // Verify queuing notification appears without crashing
      await waitFor(() => {
        expect(screen.getByText(/saved locally \(queued for sync\)/i)).toBeInTheDocument();
      });
      expect(screen.getByText('Offline Passenger')).toBeInTheDocument();
    });

    it('prevents form submission and marks empty required inputs with border-red-600 and aria-invalid="true"', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const enrollButton = screen.getByRole('button', { name: /enroll member/i });
      await user.click(enrollButton);

      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      expect(nameInput.className).toMatch(/border-red-600/);

      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      expect(ffNumberInput).toHaveAttribute('aria-invalid', 'true');
      expect(ffNumberInput.className).toMatch(/border-red-600/);

      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/frequent flyer number is required/i)).toBeInTheDocument();
    });

    it('rejects invalid FF Number format and highlights field with border-red-600', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      const enrollButton = screen.getByRole('button', { name: /enroll member/i });

      await user.type(ffNumberInput, 'INVALID-12345');
      await user.click(enrollButton);

      expect(ffNumberInput).toHaveAttribute('aria-invalid', 'true');
      expect(ffNumberInput.className).toMatch(/border-red-600/);
      expect(screen.getByText(/frequent flyer number must follow format ff-####/i)).toBeInTheDocument();
    });

    it('rejects negative miles and displays validation error', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const milesToAddInput = screen.getByRole('spinbutton', { name: /miles to add/i });
      const logMilesButton = screen.getByRole('button', { name: /log flight miles/i });

      await user.clear(milesToAddInput);
      await user.type(milesToAddInput, '-500');
      await user.click(logMilesButton);

      expect(milesToAddInput).toHaveAttribute('aria-invalid', 'true');
      expect(milesToAddInput.className).toMatch(/border-red-600/);
      expect(screen.getByText(/miles must be a positive number/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 3. NON-FUNCTIONAL REQUIREMENTS (NFRs)
  // =========================================================================
  describe('3. Non-Functional Requirements (NFRs)', () => {
    it('Accessibility (a11y): all interactive controls have explicit aria-label and proper label association', () => {
      render(<FrequentFlyerPortal />);

      const roles = ['button', 'combobox', 'textbox', 'spinbutton', 'searchbox'];
      const interactiveElements = roles.flatMap((role) => screen.getAllByRole(role));
      expect(interactiveElements.length).toBeGreaterThan(0);
      interactiveElements.forEach((el) => {
        const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
        const hasAssociatedLabel = el.id && document.querySelector(`label[for="${el.id}"]`);
        expect(hasAriaLabel || hasAssociatedLabel).toBe(true);
      });
    });

    it('Accessibility (a11y): supports full keyboard navigability for floor staff', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const searchInput = screen.getByRole('searchbox', { name: /search members/i });
      searchInput.focus();
      expect(searchInput).toHaveFocus();

      await user.tab();
      const tierFilter = screen.getByRole('combobox', { name: /filter by tier status/i });
      expect(tierFilter).toHaveFocus();
    });

    it('Telemetry Simulation: triggers console.log on primary user interactions with metadata', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      // Search interaction
      const searchInput = screen.getByRole('searchbox', { name: /search members/i });
      await user.type(searchInput, 'John');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with End-to-End Frequent Flyer Portal',
        expect.objectContaining({ action: 'SEARCH_MEMBERS' })
      );

      // Filter interaction
      const tierFilter = screen.getByRole('combobox', { name: /filter by tier status/i });
      await user.selectOptions(tierFilter, 'Gold');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with End-to-End Frequent Flyer Portal',
        expect.objectContaining({ action: 'FILTER_BY_TIER', tier: 'Gold' })
      );

      // Connectivity toggle interaction
      const networkToggle = screen.getByRole('combobox', { name: /network connectivity simulation/i });
      await user.selectOptions(networkToggle, 'offline');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] User interacted with End-to-End Frequent Flyer Portal',
        expect.objectContaining({ action: 'CONNECTIVITY_CHANGE', status: 'offline' })
      );
    });

    it('Security (XSS Sanitization): strips malicious HTML and script tags from text inputs before saving', async () => {
      const user = userEvent.setup();
      render(<FrequentFlyerPortal />);

      const maliciousPayload = '<script>alert("xss")</script>Captain Smith<img src=x onerror=alert(1)>';
      
      const nameInput = screen.getByRole('textbox', { name: /full name/i });
      const ffNumberInput = screen.getByRole('textbox', { name: /frequent flyer number/i });
      const tierSelect = screen.getByRole('combobox', { name: /select tier status/i });
      const milesInput = screen.getByRole('spinbutton', { name: /initial points balance/i });
      const flightCodeInput = screen.getByRole('textbox', { name: /last flight code/i });
      const enrollButton = screen.getByRole('button', { name: /enroll member/i });

      await user.type(nameInput, maliciousPayload);
      await user.type(ffNumberInput, 'FF-8888');
      await user.selectOptions(tierSelect, 'Platinum');
      await user.clear(milesInput);
      await user.type(milesInput, '50000');
      await user.type(flightCodeInput, 'UA-100');
      await user.click(enrollButton);

      await waitFor(() => {
        expect(screen.getByText('Captain Smith')).toBeInTheDocument();
      });

      // Verify no raw script or img tags were injected into DOM or storage
      expect(document.querySelector('script[src]')).toBeNull();
      expect(document.querySelector('img[src="x"]')).toBeNull();
      const rawStoredData = localStorage.getItem('frequent_flyer_roster') || '';
      expect(rawStoredData).not.toContain('<script>');
      expect(rawStoredData).not.toContain('onerror=');
    });

    it('Security (XSS Sanitization): sanitizer utility unit test verifies HTML tag removal', () => {
      const malicious = '<script>alert(1)</script>SafeText<img src=x onerror=alert(2)>';
      const clean = sanitizeInput(malicious);
      expect(clean).toBe('SafeText');
      expect(clean).not.toContain('<');
      expect(clean).not.toContain('>');
    });
  });
});
