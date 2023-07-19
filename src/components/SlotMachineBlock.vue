<template>
  <div class="content">
    <div class="box">{{ block }}</div>
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  name: "SlotMachineBlock",
  props: ['block', 'rolling'],
  mounted() {
    gsap.to(this.$el, {
      duration: 1.5,
      ease: "power2.out",
      y: "+=3000",
      modifiers: {
        y: gsap.utils.wrap(-100, 400)
      }
    });
  },
};
</script>

<style scoped>
.content {
  width: 110px;
  height: 100px;
  background: -webkit-linear-gradient(top, #222 0%, #666 36%, #252525 100%);
  opacity: 1;
  border-radius: 3px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: inset 0 0 7px #000;
}

.box {
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  background: -webkit-linear-gradient(top, #999 0%, #e8e8e8 15%, #ffffff 50%, #e8e8e8 85%, #999 100%);
  box-shadow: 0 0 15px -10px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  font-size: 2rem;
  line-height: 2;
  overflow: hidden;
}
@media only screen and (max-width: 768px) {
  .content {
    width: auto;
  }
}
</style>
