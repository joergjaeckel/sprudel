import {Archetype, World} from "miniplex";
import * as systems from "./systems";
import {Particle, validateParticle} from "./index";

export class ParticleSystem {

    world: World
    movingEntities: Archetype<any>
    livingEntities: Archetype<any>
    scalingEntities: Archetype<any>
    coloringEntities: Archetype<any>
    fadingEntities: Archetype<any>

    particleEntities: Archetype<any>
    emittingEntities: Archetype<any>
    ribbonEntities: Archetype<any>

    constructor() {

        this.world = new World()

        this.movingEntities = this.world.archetype("speed");
        this.livingEntities = this.world.archetype("startLifetime");

        this.scalingEntities = this.world.archetype('sizeOverLifetime');
        this.coloringEntities = this.world.archetype('colorOverLifetime');
        this.fadingEntities = this.world.archetype('opacityOverLifetime');

        this.particleEntities = this.world.archetype("particle");
        this.emittingEntities = this.world.archetype("emitting");
        this.ribbonEntities = this.world.archetype("ribbon");

    }

    update = (delta: number) => {

        systems.livingSystem(this.livingEntities.entities, this.world, delta)
        systems.emittingSystem(this.emittingEntities.entities, this.world, delta)
        systems.movingSystem(this.movingEntities.entities, delta)

        systems.keyframeSystem(this.scalingEntities.entities, 'size', delta)
        systems.keyframeSystem(this.coloringEntities.entities, 'color', delta)
        systems.keyframeSystem(this.fadingEntities.entities, 'opacity', delta)

    }

    addParticle = (object: Particle): Particle => {

        const entity = this.world.createEntity(validateParticle(object))

        return entity as Particle

    }

    destroyParticle = (object: Particle) => {

        this.world.destroyEntity(object)

    }

}
