import { Point } from "geojson";
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "true_noises" })
export class Noise extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column({
    type: "geometry",
  })
  location: Point;

  @Column("double precision")
  noise: number;

  @Column()
  dummyLocation: boolean;

  @Column()
  gpsPerturbated: boolean;

  @Column()
  perturbatorDecimals: number;

  @Column()
  dummyUpdatesCount: number;

  @Column("double precision")
  dummyUpdatesRadiusMin: number;

  @Column("double precision")
  dummyUpdatesRadiusMax: number;
}
