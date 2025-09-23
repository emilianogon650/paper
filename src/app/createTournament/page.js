'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar';

const initialFormState = {
  name: '',
  description: '',
  tournamentType: 'public',
  tradeMode: 'paper',
  duration: '1-day',
  winCondition: 'percentage-gain',
  entryFee: '10',
  maxParticipants: '1000',
  prizeMultiplier: '1000X',
  allowShortSelling: false,
  optionsTrading: false,
  realTimeLeaderboard: true,
  copyTrading: false,
};

const tournamentTypeOptions = [
  { value: 'public', label: 'Public Tournament' },
  { value: 'private', label: 'Private Tournament' },
  { value: 'protected', label: 'Protected Tournament' },
];

const tradeModeOptions = [
  { value: 'paper', label: 'Paper Trading' },
  { value: 'live', label: 'Live Trading' },
  { value: 'hybrid', label: 'Hybrid Trading' },
];

const durationOptions = [
  { value: '1-day', label: '1 Day' },
  { value: '3-day', label: '3 Days' },
  { value: '1-week', label: '1 Week' },
  { value: '1-month', label: '1 Month' },
];

const winConditionOptions = [
  { value: 'percentage-gain', label: 'Percentage Gain' },
  { value: 'absolute-return', label: 'Absolute Return' },
  { value: 'risk-adjusted', label: 'Risk Adjusted Return' },
];

const prizeMultiplierOptions = [
  { value: '50X', title: '50X', description: 'Low risk, steady return' },
  { value: '100X', title: '100X', description: 'Moderate risk, good return' },
  { value: '250X', title: '250X', description: 'High risk, great return' },
  { value: '500X', title: '500X', description: 'Very high risk, excellent returns' },
  { value: '1000X', title: '1000X', description: 'Maximum risk, maxima reward' },
];

const advancedSettingFields = [
  {
    key: 'allowShortSelling',
    label: 'Allow stock Shorting',
    description: 'Enable participants to short stocks.',
  },
  {
    key: 'optionsTrading',
    label: 'Options Trading',
    description: 'Allow options and derivatives trading.',
  },
  {
    key: 'realTimeLeaderboard',
    label: 'Real-time Leaderboard',
    description: 'Show live ranking during tournament.',
  },
  {
    key: 'copyTrading',
    label: 'Copy Trading',
    description: "Allow participants to copy each other's trades.",
  },
];

const formatCurrency = (value) => {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return '$0';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getOptionLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value;

export default function CreateTournament() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const submitTimeoutRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('cirricaToken');

    if (storedToken) {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }

    setIsCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cirricaToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));

    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleToggle = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handlePrizeSelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      prizeMultiplier: value,
    }));

    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = 'Tournament name is required.';
    }

    const entryFeeValue = Number(formData.entryFee);
    if (Number.isNaN(entryFeeValue) || entryFeeValue < 0) {
      validationErrors.entryFee = 'Entry fee cannot be negative.';
    }

    const maxParticipantsValue = Number(formData.maxParticipants);
    if (Number.isNaN(maxParticipantsValue) || maxParticipantsValue < 2) {
      validationErrors.maxParticipants = 'Allow at least two participants.';
    }

    return validationErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const action = event.nativeEvent.submitter?.dataset.action ?? 'create';
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus({ type: 'error', message: 'Double-check the highlighted fields before moving on.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: 'loading',
      message: action === 'draft' ? 'Saving your draft configuration...' : 'Saving your tournament blueprint...',
    });

    submitTimeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setStatus({
        type: 'success',
        message:
          action === 'draft'
            ? 'Draft saved. Share it with collaborators when you are ready.'
            : 'Tournament details saved. You can schedule or publish when ready.',
      });
    }, 1200);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setStatus({ type: 'idle', message: '' });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="font-poppins text-sm text-white/70">Checking your access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="font-poppins text-sm text-white/70">Redirecting you to sign in...</p>
      </div>
    );
  }

  const entryFeeValue = Number(formData.entryFee) || 0;
  const maxParticipantsValue = Number(formData.maxParticipants) || 0;
  const estimatedPrizePool = Math.max(entryFeeValue * maxParticipantsValue * 0.9, 0);
  const selectedTeams = 4;
  const teamLimit = 10;

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full flex-col lg:flex-row">
        <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-surface px-5 py-6 lg:flex lg:w-[209px] lg:flex-col lg:shrink-0">
          <Sidebar onLogout={handleLogout} activeItem="tournaments" />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-5 py-8 pl-12">
            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="font-poppins text-[22px] font-semibold leading-[100%] tracking-[0.06em] text-white">Create Tournament</h1>
                <p className="font-poppins mt-2 text-[14px] font-medium leading-[100%] tracking-[0.06em] text-white">
                  Set up a new stock trading competition
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
                <p className="font-poppins text-[14.45px] font-normal leading-[100%] text-right text-white">
                  Selected: {selectedTeams}/{teamLimit}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex h-[36px] w-[133px] items-center justify-center gap-[7.16px] rounded-[3.58px] bg-gradient-to-r from-gold to-gold-soft px-[7.16px] font-poppins text-[13px] font-medium leading-[16.1px] text-surface transition"
                  >
                    Create Team ({selectedTeams})
                  </button>
                </div>
              </div>
            </div>

            <hr className="mt-8 border-t border-white/20" />

            {status.type !== 'idle' && (
              <div
                className={`mt-8 rounded-xl border px-4 py-3 text-sm font-medium ${
                  status.type === 'success'
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : status.type === 'error'
                      ? 'border-danger/50 bg-danger/10 text-danger'
                      : 'border-white/10 bg-white/5 text-white/80'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="mt-10 gap-3 grid w-full lg:grid-cols-[minmax(0,1fr)_440px]">
              <form
                id="create-tournament-form"
                onSubmit={handleSubmit}
                className="space-y-8 w-full max-w-[707px] mx-auto lg:mx-0"
              >
                <section className="w-full max-w-[707px] h-[422px] rounded-[10px] border border-panel-border bg-panel p-6 shadow-lg shadow-black/30">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[0.06em] text-white">
                      Basic Information
                    </h2>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div>
                      <label className="font-poppins text-[14.45px] font-thin leading-[100%] text-white" htmlFor="tournament-name">
                        Tournament Name
                      </label>
                      <input
                        id="tournament-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleFieldChange('name')}
                        placeholder="eg. Tech Giants Weekly Challenge"
                        className={`mt-1 w-[649px] h-[42px] rounded-[6px] border px-4 font-poppins text-[14.45px] font-thin leading-[100%] text-white/60 placeholder:text-white/60 focus:border-gold focus:outline-none focus:ring-0 ${
                          errors.name ? 'border-danger/60' : 'border-white/20'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-2 font-poppins text-xs text-danger">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-poppins text-[14.45px] font-thin leading-[100%] text-white" htmlFor="tournament-description">
                        Description
                      </label>
                      <textarea
                        id="tournament-description"
                        name="description"
                        value={formData.description}
                        onChange={handleFieldChange('description')}
                        placeholder="Describe your tournament rules and objectives ..."
                        rows={4}
                        className="mt-1 h-[113px] w-[649px] resize-none rounded-[6px] border border-white/20 px-4 py-3 font-poppins text-[14.45px] font-thin leading-[100%] text-white/60 placeholder:text-white/60 focus:border-gold focus:outline-none focus:ring-0"
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                      <label className="font-poppins text-[14.45px] font-thin leading-[100%] text-white" htmlFor="tournament-type">
                        Tournament Type
                      </label>
                        <div className="relative mt-1 h-[42px] w-[315px]">
                          <select
                            id="tournament-type"
                            name="tournamentType"
                            value={formData.tournamentType}
                            onChange={handleFieldChange('tournamentType')}
                            className="h-full w-full appearance-none rounded-[6px] border border-white/20 bg-transparent pl-3 pr-8 font-poppins text-[14.45px] leading-[100%] text-white/60 font-thin focus:border-gold focus:outline-none focus:ring-0"
                          >
                            {tournamentTypeOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-panel text-white font-thin"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-poppins text-[14.45px] font-thin leading-[100%] text-white" htmlFor="trade-mode">
                          Trade Mode
                        </label>
                        <div className="relative mt-1 h-[42px] w-[315px]">
                          <select
                            id="trade-mode"
                            name="tradeMode"
                            value={formData.tradeMode}
                            onChange={handleFieldChange('tradeMode')}
                            className="h-full w-full appearance-none rounded-[6px] border border-white/20 bg-transparent pl-3 pr-8 font-poppins text-[14.45px] leading-[100%] text-white/60 font-thin focus:border-gold focus:outline-none focus:ring-0"
                          >
                            {tradeModeOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                className="bg-panel text-white font-thin"
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="w-[707px] h-[584px] rounded-[10px] border border-panel-border bg-panel p-6 shadow-lg shadow-black/30">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[0.06em] text-white">Tournament Setting</h2>
                  </div>

                  <div className="mt-6 space-y-8">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white" htmlFor="duration">
                          Duration
                        </label>
                        <div className="relative mt-1 h-[42px] w-[315px]">
                          <select
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleFieldChange('duration')}
                          className="h-full w-full appearance-none rounded-[6px] border border-white/20 bg-transparent pl-3 pr-8 font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white/60 focus:border-gold focus:outline-none focus:ring-0"
                          >
                            {durationOptions.map((option) => (
                              <option key={option.value} value={option.value} className="bg-panel font-thin text-white">
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white" htmlFor="win-condition">
                          Win Condition
                        </label>
                        <div className="relative mt-1 h-[42px] w-[315px]">
                          <select
                            id="win-condition"
                            name="winCondition"
                            value={formData.winCondition}
                            onChange={handleFieldChange('winCondition')}
                            className="h-full w-full appearance-none rounded-[6px] border border-white/20 bg-transparent pl-3 pr-8 font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white/60 focus:border-gold focus:outline-none focus:ring-0"
                          >
                            {winConditionOptions.map((option) => (
                              <option key={option.value} value={option.value} className="bg-panel font-thin text-white">
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white" htmlFor="entry-fee">
                          Entry Fee ($)
                        </label>
                        <input
                          id="entry-fee"
                          name="entryFee"
                          type="number"
                          min="0"
                          step="5"
                          value={formData.entryFee}
                          onChange={handleFieldChange('entryFee')}
                          className={`mt-1 h-[42px] w-[315px] rounded-[6px] border bg-transparent px-4 font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white/60 placeholder:text-white/60 focus:border-gold focus:outline-none focus:ring-0 ${
                            errors.entryFee ? 'border-danger/60' : 'border-white/20'
                          }`}
                        />
                        {errors.entryFee && (
                          <p className="mt-2 font-poppins text-xs text-danger">{errors.entryFee}</p>
                        )}
                      </div>

                      <div>
                        <label className="font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white" htmlFor="max-participants">
                          Max Participants
                        </label>
                        <input
                          id="max-participants"
                          name="maxParticipants"
                          type="number"
                          min="2"
                          step="50"
                          value={formData.maxParticipants}
                          onChange={handleFieldChange('maxParticipants')}
                          className={`mt-1 h-[42px] w-[315px] rounded-[6px] border bg-transparent px-4 font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white/60 placeholder:text-white/60 focus:border-gold focus:outline-none focus:ring-0 ${
                            errors.maxParticipants ? 'border-danger/60' : 'border-white/20'
                          }`}
                        />
                        {errors.maxParticipants && (
                          <p className="mt-2 font-poppins text-xs text-danger">{errors.maxParticipants}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[0.06em] text-white">Prize Multiplier</h3>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {prizeMultiplierOptions.map((option) => {
                          const isActive = formData.prizeMultiplier === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handlePrizeSelect(option.value)}
                              className={`flex h-[118px] w-[207px] flex-col items-center justify-center gap-1 rounded-[6px] border px-5 py-4 text-center transition ${
                                isActive
                                  ? 'border-gold bg-gradient-to-b from-gold-deep to-gold-dark'
                                  : 'border-white/20 text-white/70 hover:border-white hover:text-white'
                              }`}
                            >
                              <span className="flex h-[28px] w-[68px] items-center justify-center gap-2 font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[0.06em] text-gold-muted">
                                <svg
                                  width="10"
                                  height="16"
                                  viewBox="0 0 10 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="text-current shrink-0"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M9.967 7.707C9.89457 7.48596 9.71138 7.32074 9.48596 7.27299L6.38332 6.61619L7.31932 0.758518C7.36567 0.468169 7.21479 0.182163 6.95035 0.0596611C6.68568 -0.0630601 6.37319 0.00778505 6.1861 0.233164L0.151564 7.49206C0.0142876 7.65728 -0.033572 7.88072 0.0237732 8.08869C0.0810876 8.29667 0.2365 8.46276 0.438661 8.53208L3.44796 9.5651L2.23438 15.2072C2.17187 15.4982 2.31153 15.7951 2.57425 15.9296C2.66712 15.9771 2.76714 16 2.86607 16C3.0471 16 3.22513 15.9231 3.351 15.7787L9.83816 8.34588C9.99048 8.17129 10.0396 7.92803 9.967 7.707ZM4.02642 13.0282L4.83441 9.27234C4.90445 8.94711 4.72191 8.6208 4.41047 8.51398L1.75031 7.60084L5.66953 2.8869L5.00852 7.02361C4.95333 7.36846 5.1762 7.69631 5.51433 7.76803L8.13356 8.32235L4.02642 13.0282Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                {option.title}
                              </span>
                              <span className="flex h-[42px] w-[108px] items-center justify-center font-poppins text-sm text-center">
                                {option.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="w-[707px] h-[388px] rounded-[10px] border border-panel-border bg-panel px-6 py-10 shadow-lg shadow-black/30">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[0.06em] text-white">Advanced Settings</h2>
                  </div>

                  <div className="mt-6 space-y-6">
                    {advancedSettingFields.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-1">
                        <div className="space-y-2">
                          <p className="font-poppins text-[16px] font-medium leading-[100%] tracking-[0%] text-white">{setting.label}</p>
                          <p className="font-poppins text-[14px] font-normal leading-[100%] tracking-[0%] text-white/60">{setting.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleToggle(setting.key)}
                          className={`relative h-[37px] w-[70px] rounded-[100px] transition ${
                            formData[setting.key]
                              ? 'bg-gold-muted'
                              : 'bg-toggle-off'
                          }`}
                          aria-pressed={formData[setting.key]}
                        >
                          <span
                            className={`absolute top-[4px] left-[4px] h-[29px] w-[29px] rounded-full transition-transform ${
                              formData[setting.key]
                                ? 'translate-x-[33px] bg-toggle-knob'
                                : 'translate-x-0 bg-white'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </form>

              <aside className="space-y-6 w-full max-w-[440px] mx-auto lg:mx-0">
                <section className="w-full max-w-[440px] h-[369px] rounded-[10px] border border-panel-border bg-panel p-6 shadow-xl shadow-black/40">
                  <header className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <svg
                          width="28"
                          height="27"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-white"
                          aria-hidden="true"
                        >
                          <path
                            d="M6.625 7.59961C6.625 8.50466 6.9798 9.37366 7.6123 10.0146C8.24498 10.6558 9.10382 11.0166 10 11.0166C10.8962 11.0166 11.755 10.6558 12.3877 10.0146C13.0202 9.37366 13.375 8.50466 13.375 7.59961V2.2832H6.625V7.59961ZM2.25 6.33301C2.25 6.73419 2.40755 7.11962 2.68848 7.4043C2.96952 7.68909 3.3511 7.84961 3.75 7.84961H4.625V4.18359H2.25V6.33301ZM15.375 7.84961H16.25C16.6489 7.84961 17.0305 7.68909 17.3115 7.4043C17.5925 7.11962 17.75 6.73419 17.75 6.33301V4.18359H15.375V7.84961ZM9 12.9561L8.80664 12.9111C8.03153 12.7311 7.30554 12.3781 6.68066 11.8789C6.0558 11.3797 5.54752 10.7462 5.19336 10.0234L5.125 9.88379H3.75C2.82283 9.88379 1.933 9.5101 1.27637 8.84473C0.619617 8.17922 0.25 7.27559 0.25 6.33301V3.16699C0.25 2.8963 0.356035 2.6367 0.543945 2.44629C0.731735 2.25605 0.985907 2.15039 1.25 2.15039H4.625V0.25H15.375V2.15039H18.75C19.0141 2.15039 19.2683 2.25605 19.4561 2.44629C19.644 2.6367 19.75 2.89629 19.75 3.16699V6.33301C19.75 7.27559 19.3804 8.17922 18.7236 8.84473C18.067 9.5101 17.1772 9.88379 16.25 9.88379H14.875L14.8066 10.0234C14.4525 10.7462 13.9442 11.3797 13.3193 11.8789C12.6945 12.3781 11.9685 12.7311 11.1934 12.9111L11 12.9561V16.7168H15.375V18.75H4.625V16.7168H9V12.9561Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="0"
                          />
                        </svg>
                        <p className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[6%] not-italic text-white">
                          Tournament Preview
                        </p>
                      </div>
                      <div className="flex h-[28px] w-[68px] items-center gap-2 text-gold-muted">
                        <svg
                          width="10"
                          height="16"
                          viewBox="0 0 10 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-[10px] shrink-0"
                          aria-hidden="true"
                        >
                          <path
                            d="M9.967 7.707C9.89457 7.48596 9.71138 7.32074 9.48596 7.27299L6.38332 6.61619L7.31932 0.758518C7.36567 0.468169 7.21479 0.182163 6.95035 0.0596611C6.68568 -0.0630601 6.37319 0.00778505 6.1861 0.233164L0.151564 7.49206C0.0142876 7.65728 -0.033572 7.88072 0.0237732 8.08869C0.0810876 8.29667 0.2365 8.46276 0.438661 8.53208L3.44796 9.5651L2.23438 15.2072C2.17187 15.4982 2.31153 15.7951 2.57425 15.9296C2.66712 15.9771 2.76714 16 2.86607 16C3.0471 16 3.22513 15.9231 3.351 15.7787L9.83816 8.34588C9.99048 8.17129 10.0396 7.92803 9.967 7.707ZM4.02642 13.0282L4.83441 9.27234C4.90445 8.94711 4.72191 8.6208 4.41047 8.51398L1.75031 7.60084L5.66953 2.8869L5.00852 7.02361C4.95333 7.36846 5.1762 7.69631 5.51433 7.76803L8.13356 8.32235L4.02642 13.0282Z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="font-poppins text-[18.45px] font-semibold leading-[100%] tracking-[6%] text-right text-gold-muted">
                          {formData.prizeMultiplier.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="pl-2 font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white">
                        {formData.name || 'Tech Giant weekly Challenge'}
                      </h3>
                      <span className="flex h-[24px] w-[111px] items-center justify-center rounded-[100px] bg-gold-muted font-poppins text-[12px] font-normal leading-[100%] tracking-[0%] text-black">
                        {`${getOptionLabel(tournamentTypeOptions, formData.tournamentType).split(' ')[0].toLowerCase()} + ${getOptionLabel(tradeModeOptions, formData.tradeMode).split(' ')[0].toLowerCase()}`}
                      </span>
                    </div>
                  </header>

                  <div className="mt-5 space-y-5 text-sm text-white/70 px-2">
                    <dl className="space-y-3">
                      <div className="flex items-center justify-between py-1">
                        <dt className="flex items-center gap-2 font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                          <svg
                            width="19"
                            height="19"
                            viewBox="0 0 34 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                            aria-hidden="true"
                          >
                            <path
                              d="M17 0.25C26.2388 0.25 33.75 7.76123 33.75 17C33.75 26.2388 26.2388 33.75 17 33.75C7.76123 33.75 0.25 26.2388 0.25 17C0.25 7.76123 7.76123 0.25 17 0.25ZM17 3.11426C9.34614 3.11426 3.11426 9.34614 3.11426 17C3.11426 24.6539 9.34614 30.8857 17 30.8857C24.6539 30.8857 30.8857 24.6539 30.8857 17C30.8857 9.34614 24.6539 3.11426 17 3.11426Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0"
                            />
                            <path
                              d="M15.8899 24.7128L15.6575 24.6962C13.8334 24.5657 12.3891 23.2054 12.1174 21.4394L12.095 21.2675L12.093 21.2538L12.095 21.2343C12.0983 21.2251 12.1055 21.2131 12.1204 21.1991C12.1518 21.1695 12.1992 21.1513 12.2405 21.1513H14.2083C14.2472 21.1513 14.272 21.1625 14.2864 21.1738C14.2998 21.1843 14.3147 21.2023 14.3215 21.2363L14.3235 21.245C14.4913 21.9573 15.122 22.5107 15.8909 22.5107H17.6086C18.7241 22.5106 19.7742 21.6769 19.8967 20.5341L19.8977 20.5312C20.0185 19.2428 19.012 18.1104 17.7161 18.1103H16.4631C14.217 18.1102 12.2433 16.5433 11.9075 14.3603L11.8801 14.1474C11.6435 11.7076 13.3708 9.64351 15.6731 9.33879L15.8899 9.30949V7.12199C15.8899 7.06462 15.9277 7.01263 15.9788 6.99016L16.0334 6.97844H17.9661C18.0427 6.97844 18.1095 7.04538 18.1096 7.12199V9.28801L18.342 9.30363C20.217 9.43756 21.6899 10.8712 21.9016 12.7089C21.8995 12.784 21.8354 12.8486 21.76 12.8486H19.7913C19.7524 12.8485 19.7275 12.8374 19.7131 12.8261C19.7065 12.8208 19.6996 12.8136 19.6936 12.8036L19.679 12.7636L19.677 12.7558L19.6399 12.6239C19.4297 11.976 18.8306 11.4892 18.1096 11.4892H16.3918C15.2764 11.4892 14.2254 12.323 14.1028 13.4657V13.4697C13.9822 14.7579 14.9885 15.8896 16.2844 15.8896H17.7512C20.325 15.8896 22.3902 18.1261 22.1194 20.7323V20.7333C21.9171 22.7542 20.2975 24.2855 18.3176 24.6269L18.1096 24.663V26.8779C18.1096 26.9545 18.0427 27.0214 17.9661 27.0214H16.0334C15.9569 27.0212 15.8899 26.9544 15.8899 26.8779V24.7128Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="0"
                            />
                          </svg>
                          Entry Fee
                        </dt>
                        <dd className="font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-right text-white">
                          {formatCurrency(entryFeeValue)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <dt className="flex items-center gap-2 font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                          <svg
                            width="20"
                            height="14"
                            viewBox="0 0 22 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                            aria-hidden="true"
                          >
                            <path
                              d="M9.95406 7.2534C10.8166 6.49593 11.3666 5.37563 11.3666 4.12505C11.3666 1.85071 9.55715 0 7.33325 0C5.10935 0 3.29991 1.85059 3.29991 4.12505C3.29991 5.37565 3.84897 6.49689 4.71245 7.2534C1.96153 8.33526 0 11.0595 0 14.2498C0 14.6641 0.328149 14.9998 0.733314 14.9998C1.13848 14.9998 1.46663 14.6641 1.46663 14.2498C1.46663 10.9414 4.09834 8.24987 7.33314 8.24987C10.5679 8.24987 13.1996 10.9414 13.1996 14.2498C13.1996 14.6641 13.5278 14.9998 13.933 14.9998C14.3381 14.9998 14.6663 14.6641 14.6663 14.2498C14.6663 11.0595 12.7058 8.33603 9.95406 7.2534ZM4.76689 4.12505C4.76689 2.67759 5.91818 1.49998 7.33361 1.49998C8.74903 1.49998 9.90032 2.67744 9.90032 4.12505C9.90032 5.57266 8.74903 6.75013 7.33361 6.75013C5.91818 6.75013 4.76689 5.57266 4.76689 4.12505ZM21.9999 14.25C21.9999 14.6644 21.6717 15 21.2666 15C20.8614 15 20.5333 14.6644 20.5333 14.25C20.5333 10.9417 17.9015 8.25011 14.6667 8.25011C14.2616 8.25011 13.9334 7.9145 13.9334 7.50012C13.9334 7.08574 14.2616 6.75013 14.6667 6.75013C16.082 6.75013 17.2335 5.57266 17.2335 4.12505C17.2335 2.67744 16.0822 1.49998 14.6667 1.49998C14.2643 1.49998 13.8793 1.59185 13.5237 1.77372C13.1607 1.9584 12.7216 1.80934 12.5401 1.43811C12.3586 1.06779 12.5062 0.616862 12.8683 0.432185C13.4293 0.145318 14.0343 0 14.6667 0C16.8905 0 18.7001 1.85059 18.7001 4.12505C18.7001 5.37565 18.151 6.49689 17.2875 7.2534C20.0385 8.33526 22 11.0595 22 14.2498L21.9999 14.25Z"
                              fill="currentColor"
                            />
                          </svg>
                          Max Participants
                        </dt>
                        <dd className="font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-right text-white">
                          {maxParticipantsValue.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <dt className="flex items-center gap-2 font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.5 17C6.81886 17 5.17545 16.5015 3.77763 15.5675C2.37981 14.6335 1.29037 13.306 0.647024 11.7528C0.00367892 10.1996 -0.164644 8.49058 0.16333 6.84174C0.491305 5.1929 1.30088 3.67835 2.48962 2.4896C3.67837 1.30085 5.1929 0.491302 6.84174 0.163328C8.49058 -0.164647 10.1996 0.00368694 11.7528 0.647032C13.306 1.29038 14.6335 2.37984 15.5675 3.77766C16.5015 5.17548 17 6.81886 17 8.5C17 10.7543 16.1044 12.9163 14.5104 14.5104C12.9163 16.1045 10.7543 17 8.5 17ZM8.5 1.41667C7.09905 1.41667 5.72958 1.8321 4.56473 2.61043C3.39989 3.38875 2.49199 4.49502 1.95587 5.78933C1.41975 7.08364 1.27945 8.50786 1.55276 9.88189C1.82607 11.2559 2.50072 12.5181 3.49134 13.5087C4.48196 14.4993 5.74406 15.1739 7.11809 15.4472C8.49212 15.7205 9.91633 15.5803 11.2106 15.0441C12.5049 14.508 13.6112 13.6001 14.3896 12.4353C15.1679 11.2704 15.5833 9.90095 15.5833 8.5C15.5833 6.62139 14.837 4.81971 13.5087 3.49132C12.1803 2.16294 10.3786 1.41667 8.5 1.41667ZM10.0796 11.1208L8.0042 9.03904C7.93188 8.96799 7.87551 8.88234 7.83887 8.78781C7.80224 8.69327 7.78613 8.59203 7.79166 8.49079V4.95834C7.79166 4.77047 7.86626 4.59031 7.9991 4.45747C8.13194 4.32463 8.31214 4.25 8.5 4.25C8.68786 4.25 8.86806 4.32463 9.0009 4.45747C9.13374 4.59031 9.20833 4.77047 9.20833 4.95834V8.1678L11.1208 10.0803C11.1891 10.1487 11.2434 10.2298 11.2803 10.3191C11.3173 10.4084 11.3363 10.5042 11.3363 10.6008C11.3362 10.6975 11.3171 10.7932 11.2801 10.8825C11.243 10.9717 11.1888 11.0529 11.1205 11.1212C11.0521 11.1895 10.9709 11.2437 10.8816 11.2807C10.7923 11.3176 10.6966 11.3366 10.5999 11.3366C10.5033 11.3366 10.4076 11.3175 10.3183 11.2805C10.229 11.2435 10.1479 11.1892 10.0796 11.1208Z"
                              fill="currentColor"
                            />
                          </svg>
                          Duration
                        </dt>
                        <dd className="font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-right text-white">
                          {getOptionLabel(durationOptions, formData.duration)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <dt className="flex items-center gap-2 font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                            aria-hidden="true"
                          >
                            <path
                              d="M8 16C3.5957 16 0 12.4043 0 8C0 3.5957 3.5957 0 8 0C12.4043 0 16 3.5957 16 8C16 12.4043 12.4043 16 8 16ZM8 1.72043C4.54194 1.72043 1.72043 4.54194 1.72043 8C1.72043 11.4581 4.54194 14.2796 8 14.2796C11.4581 14.2796 14.2796 11.4581 14.2796 8C14.2796 4.54194 11.4581 1.72043 8 1.72043Z"
                              fill="currentColor"
                            />
                            <path
                              d="M8.00048 12.6967C5.40264 12.6967 3.30371 10.5806 3.30371 7.99997C3.30371 5.40212 5.41984 3.30319 8.00048 3.30319C10.5983 3.30319 12.6973 5.41932 12.6973 7.99997C12.6973 10.5978 10.5983 12.6967 8.00048 12.6967ZM8.00048 5.02362C6.34887 5.02362 5.02414 6.36556 5.02414 7.99997C5.02414 9.63437 6.34887 10.9763 8.00048 10.9763C9.6521 10.9763 10.9768 9.65158 10.9768 7.99997C10.9768 6.34835 9.6521 5.02362 8.00048 5.02362Z"
                              fill="currentColor"
                            />
                            <path
                              d="M7.99991 9.30737C8.72204 9.30737 9.30744 8.72198 9.30744 7.99985C9.30744 7.27772 8.72204 6.69232 7.99991 6.69232C7.27778 6.69232 6.69238 7.27772 6.69238 7.99985C6.69238 8.72198 7.27778 9.30737 7.99991 9.30737Z"
                              fill="currentColor"
                            />
                          </svg>
                          Win Condition
                        </dt>
                        <dd className="font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-right text-white">
                          {getOptionLabel(winConditionOptions, formData.winCondition)}
                        </dd>
                      </div>
                    </dl>

                    <div className="rounded-xl px-4 py-4 text-center">
                      <p className="font-poppins text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                        Estimated Prize Pool
                      </p>
                      <p className="font-poppins mt-3 text-[20.45px] font-bold leading-[100%] tracking-[0%] text-gold-muted">
                        {formatCurrency(estimatedPrizePool)}
                      </p>
                      <p className="font-poppins mt-2 text-[14.45px] font-normal leading-[100%] tracking-[0%] text-white/60">
                        (90% of entry fees, 10% platform fee)
                      </p>
                    </div>

                  </div>
                </section>

                <section className="space-y-3">
                  <button
                    type="submit"
                    form="create-tournament-form"
                    data-action="create"
                    disabled={isSubmitting}
                    className="inline-flex h-[43px] w-[440px] items-center justify-center rounded-[3.58px] bg-gradient-to-r from-gold to-gold-soft px-[7.16px] py-[7.16px] font-poppins text-[13px] font-medium leading-[16.1px] tracking-[0%] text-surface shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex items-center gap-[7.16px] align-middle">
                      <svg
                        width="15"
                        height="12"
                        viewBox="0 0 16 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-current"
                        aria-hidden="true"
                      >
                        <path
                          d="M15.5514 2.92291C15.2701 2.6829 14.8884 2.62209 14.5534 2.76357L11.0447 4.25116L9.31437 0.585112C9.14534 0.226767 8.79977 0 8.42178 0C8.0438 0 7.69823 0.226107 7.52919 0.584452L5.79951 4.25118L2.29082 2.76359C1.95523 2.62144 1.57349 2.68226 1.29218 2.92292C1.01149 3.16359 0.874881 3.54705 0.936008 3.92457L2.13425 11.3399C2.20473 11.7697 2.58835 12.0593 2.99441 11.9892L3.54831 11.892C6.77501 11.3247 10.0685 11.3247 13.2952 11.892L13.8491 11.9892C14.2551 12.0606 14.6394 11.771 14.7086 11.3406L15.9075 3.92455C15.968 3.54703 15.8321 3.16423 15.5514 2.92291ZM13.7674 10.9029L13.4587 10.8487H13.458C10.1234 10.2623 6.72026 10.2623 3.38561 10.8487L3.07685 10.9029L1.91978 3.74599L5.42911 5.23358C5.91065 5.43391 6.45707 5.21375 6.69223 4.7245L8.42191 1.05777L10.1516 4.7245C10.3868 5.21375 10.9332 5.43391 11.4147 5.23358L14.924 3.74533L13.7674 10.9029Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="0.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="align-middle">
                        {isSubmitting ? 'Saving...' : 'Create Tournament'}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-[43px] w-[440px] items-center justify-center gap-[7.16px] rounded-[3.58px] border border-panel bg-panel px-[7.16px] font-poppins text-[13px] font-medium leading-[16.1px] tracking-[0%] text-white transition hover:border-panel hover:bg-panel"
                  >
                    Schedule for later
                  </button>
                  <button
                    type="submit"
                    form="create-tournament-form"
                    data-action="draft"
                    disabled={isSubmitting}
                    className="inline-flex h-[43px] w-[440px] items-center justify-center gap-[7.16px] rounded-[3.58px] border border-white bg-transparent px-[7.16px] font-poppins text-[13px] font-medium leading-[16.1px] tracking-[0%] text-white transition hover:border-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Save as Draft
                  </button>
                </section>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
