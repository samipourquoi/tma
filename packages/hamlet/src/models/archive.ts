import { STRING } from "sequelize";
import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Archive
	extends Model
{
	@Column(STRING)
	name: string;
}

