import { Employee } from "../renderer/scripts/models/Employee";
import { ContentCols } from "./ContentCols";

export interface Config {
	isAsideOut: boolean;
	contentWidth?: ContentCols;
	asideWidth: number;
	[key: string]: Employee | Employee[] | boolean | number | ContentCols | null;
}
