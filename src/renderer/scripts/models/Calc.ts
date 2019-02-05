import shortid from "shortid";
import { CalcProp, CalcProps } from "../../../@types";

export class Calc {
	public properties: CalcProps;
	public changes: CalcProps;

	constructor(c: CalcProps) {
		if (c) {
			this.properties = {
				id: c.id || shortid.generate(),
				regularWork: c.regularWork,
				nightWork: c.nightWork,
				stateHoliday: c.stateHoliday,
				extraNationalHoliday: c.extraNationalHoliday,
				extraNightNationalHoliday: c.extraNightNationalHoliday,
				payedLeave: c.payedLeave,
				ngoOld: c.ngoOld,
				suspension: c.suspension,
				correction: c.correction,
				addWorkHours: c.addWorkHours,
				absences: c.absences,
				sickLeavePregnancy: c.sickLeavePregnancy,
				sickLeave100: c.sickLeave100,
				sickLeave: c.sickLeave,
				performance: c.performance,
				sickLeaveSIZ: c.sickLeaveSIZ,
				holidayN: c.holidayN,
				correctionN: c.correctionN,
				performance65: c.performance65,
				performanceSIZ: c.performanceSIZ,
				performancePregnancy: c.performancePregnancy,
				workNationalHoliday: c.workNationalHoliday,
				workNightNationalHoliday: c.workNightNationalHoliday,
				additional: c.additional,
				severance: c.severance,
				transportation: c.transportation,
				dailyAllowance: c.dailyAllowance,
				additionalmld: c.additionalmld
			};
		} else {
			this.properties = {
				id: shortid.generate(),
				regularWork: {value: 0, hours: 0},
				nightWork: {value: 0, hours: 0},
				stateHoliday: {value: 0, hours: 0},
				extraNationalHoliday: {value: 0, hours: 0},
				extraNightNationalHoliday: {value: 0, hours: 0},
				payedLeave: {value: 0, hours: 0},
				ngoOld: {value: 0, hours: 0},
				suspension: {value: 0, hours: 0},
				correction: {value: 0, hours: 0},
				addWorkHours: {value: 0, hours: 0},
				absences: {value: 0, hours: 0},
				sickLeavePregnancy: {value: 0, hours: 0},
				sickLeave100: {value: 0, hours: 0},
				sickLeave: {value: 0, hours: 0},
				performance: {value: 0, hours: 0},
				sickLeaveSIZ: {value: 0, hours: 0},
				holidayN: {value: 0, hours: 0},
				correctionN: {value: 0, hours: 0},
				performance65: {value: 0, hours: 0},
				performanceSIZ: {value: 0, hours: 0},
				performancePregnancy: {value: 0, hours: 0},
				workNationalHoliday: {value: 0, hours: 0},
				workNightNationalHoliday: {value: 0, hours: 0},
				additional: {value: 0, hours: 0},
				severance: {value: 0, hours: 0},
				transportation: {value: 0, hours: 0},
				dailyAllowance: {value: 0, hours: 0},
				additionalmld: {value: 0, hours: 0}
			};
		}
		this.changes = {id: this.properties.id};
	}

	public commitChanges() {
		console.log(this);
	}
}
