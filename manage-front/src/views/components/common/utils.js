import {
    deepClone
} from '@/utils'
import store from '@/store'

export const ORG_AREA = deepClone(store.getters.area);
