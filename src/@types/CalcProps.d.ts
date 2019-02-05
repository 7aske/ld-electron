import { CalcProp } from "./CalcProp";

export interface CalcProps {
	id: string;
	regularWork?: CalcProp;
	nightWork?: CalcProp;
	stateHoliday?: CalcProp;
	extraNationalHoliday?: CalcProp;
	extraNightNationalHoliday?: CalcProp;
	payedLeave?: CalcProp;
	ngoOld?: CalcProp;
	suspension?: CalcProp;
	correction?: CalcProp;
	addWorkHours?: CalcProp;
	absences?: CalcProp;
	sickLeavePregnancy?: CalcProp;
	sickLeave100?: CalcProp;
	sickLeave?: CalcProp;
	performance?: CalcProp;
	sickLeaveSIZ?: CalcProp;
	holidayN?: CalcProp;
	correctionN?: CalcProp;
	performance65?: CalcProp;
	performanceSIZ?: CalcProp;
	performancePregnancy?: CalcProp;
	workNationalHoliday?: CalcProp;
	workNightNationalHoliday?: CalcProp;
	additional?: CalcProp;
	severance?: CalcProp;
	transportation?: CalcProp;
	dailyAllowance?: CalcProp;
	additionalmld?: CalcProp;
	[key: string]: CalcProp | string;
}
