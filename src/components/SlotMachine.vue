<template>
  <div class="slot-machine">
    <div class="slot-machine__buddy">
      <div class="blocks">
        <div class="contents">
          <SlotMachineBlock class="slot-machine-block" v-for="(block, i) in blocks" :key="i" :block="block" :rolling="rolling" />
<!--          <div class="content" v-for="(block, index) in blocks" :key="index">-->
<!--            <div class="box" :class="rolling ? 'animate' : ''">{{ block }}</div>-->
<!--          </div>-->
        </div>
      </div>
      <div class="lever" id="slot-trigger" @click="slotTriggerMove">
        <svg id="trigger" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="35" height="143.6" viewBox="0 0 35 143.6">
          <defs>
            <linearGradient id="linear-gradient" x1="6.21" y1="143.63" x2="6.21" y2="67.37" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#515151"/>
              <stop offset="0.21" stop-color="#989898"/>
              <stop offset="0.51" stop-color="#e3e3e3"/>
              <stop offset="0.82" stop-color="#949494"/>
              <stop offset="1" stop-color="#444"/>
            </linearGradient>
            <linearGradient id="linear-gradient-2" x1="23.71" y1="127.98" x2="23.71" y2="83.01" xlink:href="#linear-gradient"/>
            <linearGradient id="linear-gradient-3" x1="20.46" y1="55.66" x2="25.41" y2="55.66" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#6b6b6b"/>
              <stop offset="1" stop-color="#454545"/>
            </linearGradient>
            <radialGradient id="radial-gradient" cx="23.05" cy="12.33" fx="31.426365772510508" r="12.04" gradientTransform="translate(1.5 -0.3) scale(0.93 0.93)" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#e47f7f"/>
              <stop offset="0.68" stop-color="#ae292a"/>
            </radialGradient>
          </defs>
          <path id="ring1" d="M0,67.4H7.3a5.1,5.1,0,0,1,5.1,5.1v66.1a5.1,5.1,0,0,1-5.1,5.1H0a0,0,0,0,1,0,0V67.4A0,0,0,0,1,0,67.4Z" fill="url(#linear-gradient)"/>
          <path id="ring2" d="M12.4,83H29.7A5.3,5.3,0,0,1,35,88.3v34.4a5.3,5.3,0,0,1-5.3,5.3H12.4a0,0,0,0,1,0,0V83A0,0,0,0,1,12.4,83Z" fill="url(#linear-gradient-2)"/>
          <ellipse id="hole" cx="22.9" cy="88.6" rx="5.9" ry="2.2" fill="#3f3f3f"/>
          <rect id="stick" x="20.5" y="22.2" width="5" height="66.88" fill="url(#linear-gradient-3)"/>
          <ellipse id="head" cx="22.9" cy="11.3" rx="11.2" ry="11.3" fill="url(#radial-gradient)"/>
        </svg>
      </div>
    </div>
    <div class="card">
      <!-- Display the user's credits -->
      <div class="credits" id="credits">Your Credits: {{ credits }}</div>
      <!-- Display the cash out button -->
      <button class="cash-out" ref="cashOut" @mouseover="handleCashOutHover" @click="cashOut">CASH OUT</button>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import SlotMachineBlock from "../components/SlotMachineBlock";
export default {
  name: "SlotMachine",
  data() {
    return {
      blocks: ["X", "X", "X"],
      symbols: ["🍒", "🍊", "🍋", "🍉"],
      credits: 10,
      cashOutBtn: null,
      rolling: false,
      loading: false
    };
  },
  components: {
    SlotMachineBlock,
  },
  mounted() {
    this.cashOutBtn = this.$refs.cashOut;
  },
  methods: {
    slotTriggerMove() {

      const head = document.getElementById("head")
      const stick = document.getElementById("stick")
      const hole = document.getElementById("hole")
      if (this.credits > 0 || !this.loading || !this.rolling) {
        gsap.set([head, stick, hole], { y: 0, scale: 1 });
        gsap.to(head, 0.4, { y: 70, repeat: 1, yoyo: true, ease: "sine.in" });
        gsap.to(stick, 0.4, { y: 14, scaleY: 0.3, transformOrigin: "50% 100%", repeat: 1, yoyo: true, ease: "sine.in" });
        gsap.to(hole, 0.4, { y: 10, scaleY: 2, repeat: 1, yoyo: true, ease: "sine.in" });
        this.pullLever()
      }
    },
    // Define a method to generate a random symbol from the list of possible symbols
    randomSymbol() {
      return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    },
    // Define a method to pull the lever and spin the slot machine blocks
    pullLever() {
      if (this.credits === 0 || this.rolling) return;
      this.rolling = true;
      this.loading = true;
      this.credits -= 1;
      this.blocks = Array(3).fill("X");
      setTimeout(() => {
        this.blocks[0] = this.randomSymbol();
        setTimeout(() => {
          this.blocks[1] = this.randomSymbol();
          setTimeout(() => {
            this.blocks[2] = this.randomSymbol();
            setTimeout(() => {
              if (this.shouldReroll(this.credits)) { // Check if should reroll
                this.blocks = [this.randomSymbol(), this.randomSymbol(), this.randomSymbol()];
              }
              setTimeout(() => {
                if (this.blocks.every((block) => block === this.blocks[0])) {
                  const rewards = { "🍒": 10, "🍋": 20, "🍊": 30, "🍉": 40 };
                  this.credits += rewards[this.blocks[0]];
                }
                this.rolling = false;
                this.loading = false;
              }, 0);
            }, 0);
          }, 1000);
        }, 1000);
      }, 1000);
    },
    shouldReroll(currentCredits) {
      if (currentCredits >= 40 && currentCredits < 60) {
        return Math.random() < 0.3; // 30% chance to reroll for credits between 40 and 60
      }
      if (currentCredits >= 60) {
        return Math.random() < 0.6; // 60% chance to reroll for credits above 60
      }
      return false;
    },
    cashOut() {
      if (this.credits > 0) {
        window.alert(`Cashing out ${this.credits} credits!`);
        this.credits = 0;
      }
    },
    handleCashOutHover() {
      // If the user has no credits, display an alert and do nothing
      if (this.credits === 0) {
        alert("You don't have any credits to cash out!");
        return;
      }

      // Randomly move the button in a random direction by 300px with a 50% chance
      if (Math.random() < 0.5) {
        this.cashOutBtn.style.transform = `translate(${Math.floor(Math.random() * 600) - 300}px, ${Math.floor(Math.random() * 600) - 300}px)`;
      }
      // Make the button unclickable with a 40% chance
      else if (Math.random() < 0.4) {
        this.cashOutBtn.style.pointerEvents = "none";
        setTimeout(() => {
          this.cashOutBtn.style.pointerEvents = "auto";
        }, 1000);
      }
    },
  },
};
</script>

<style scoped>

.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.contents {
  display: flex;
  padding: 10px;
}

.slot-machine__buddy {
  display: flex;
}

.blocks {
  width: 110%;
  height: 100%;
  background: -webkit-linear-gradient(top, #ffffff 0%, #151516 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.lever {
  margin-top: -40px;
}

.card {
  padding: 20px;
  margin-top: 20px;
}

.credits {
  font-size: 2rem;
  margin-top: 1rem;
  display: flex;
  justify-items: center;
  align-items: center;
  color: #333;
}

.cash-out {
  width: 150px;
  height: 50px;
  font-size:1em;
  margin-top: 10px;
  background: #00F260;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #0575E6, #00F260);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #0575E6, #00F260); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
