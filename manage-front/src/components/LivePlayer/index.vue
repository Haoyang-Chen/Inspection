<template>
  <div>
    <LivePlayer ref="player" :videoUrl="videoUrl" live controls autoplay />
  </div>
</template>

<script>
import LivePlayer from '@liveqing/liveplayer';

export default {
  name: 'LivePlayerDemo',
  components: { LivePlayer },
  props: {
    // 视频地址
    videoUrl: {
      type: String,
      default: ''
    }
  },
  methods: {}
}
</script>
