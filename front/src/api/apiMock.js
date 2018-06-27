import * as constructors from './mock/constructors';
import * as instances from './mock/instances';

export default function subscribeMockRequests(mockApi) {
  mockApi
    // .onAny('/constructors').reply(200, constructors.constructorListProd)
    // .onAny('/instances').reply(200, instances.instanceList)
    // go to deploy step 1 (request form)
    // .onAny(/\/constructors\/.{24}\/params/).reply(200, constructors.ctorAtomicSwap)
    // go to deploy step 2 (request code)
    .onAny(/\/constructors\/.{24}\/construct/)
    .replyOnce(500)

    // .onAny(/\/constructors\/.{24}\/construct/)
    // .replyOnce(200, instances.instanceCode)

    .onAny()
    .passThrough();
}
