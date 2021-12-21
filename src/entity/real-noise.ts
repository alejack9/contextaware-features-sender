import { Point } from "geojson";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity({ name: "real_noise1" })
export class RealNoise extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public timestamp: Date;

  @Column({
    type: "geometry",
    srid: 3857,
  })
  public location: Point;

  @Column("double precision")
  public noise: number;
}
