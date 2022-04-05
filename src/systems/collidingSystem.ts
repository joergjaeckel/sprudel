import type { World } from 'miniplex'
import {ArrowHelper, Raycaster, Scene, Vector3} from "three";

const raycaster = new Raycaster();
raycaster.layers.set( 1 );

//const helper = new ArrowHelper(new Vector3(0,1,0), new Vector3(0,0,0), 10)

let tempVec0 = new Vector3()

export const collidingSystem = (world: World, scene: Scene, delta: number) => {
  const { entities } = world.archetype('collide')

  //if(!helper.parent) scene.add(helper)

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i]

    raycaster.set(entity.position, entity.velocity)
    const intersects = raycaster.intersectObjects( scene.children, true );

    if(intersects[0] && intersects[0].distance < 1 && intersects[ 0 ].face) {

      tempVec0 = intersects[0].face.normal.clone();
      tempVec0.transformDirection( intersects[ 0 ].object.matrixWorld );
      entity.velocity.reflect(tempVec0)

    }

    //helper.position.copy(entity.position)
    //helper.setDirection(entity.velocity)

  }
}
