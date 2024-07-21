export type Config = {
  accounts: Record<string, MuskEmpireAccount>;
};

export type Proxy = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export type MuskEmpireAccount = {
  clientName: string;
  currentCooldowns: Cooldowns;
};

export type Cooldowns = {
  noUpgradesUntil: number;
  noOfflineBonusUntil: number;
};

export const defaultConfig: Config = {
  accounts: {},
};

export const defaultHamsterAccount = {
  clientName: '',
  currentCooldowns: {
	noUpgradesUntil: 0,
	noOfflineBonusUntil: 0,
  },
};
