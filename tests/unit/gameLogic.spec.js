import { mount, shallowMount  } from '@vue/test-utils'
import SlotMachine from '../../src/components/SlotMachine'
import { jest } from '@jest/globals';

describe('SlotMachine', () => {

    it('matches the snapshot', () => {
        const wrapper = mount(SlotMachine)
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('renders the correct number of blocks', () => {
        const wrapper = mount(SlotMachine)
        expect(wrapper.findAll('.slot-machine-block').length).toBe(3)
    })

    it('starts with the correct credits', () => {
        const wrapper = mount(SlotMachine)
        expect(wrapper.vm.credits).toBe(10)
    })


    it('should display the result after a delay', () => {
        jest.useFakeTimers();

        const wrapper = shallowMount(SlotMachine);

        wrapper.vm.pullLever();

        expect(wrapper.vm.blocks).toEqual(["X", "X", "X"]);

        jest.advanceTimersByTime(1000);

        expect(wrapper.vm.blocks[0]).not.toEqual("X");
        expect(wrapper.vm.blocks[1]).toEqual("X");
        expect(wrapper.vm.blocks[2]).toEqual("X");

        jest.advanceTimersByTime(1000);

        expect(wrapper.vm.blocks[1]).not.toEqual("X");
        expect(wrapper.vm.blocks[2]).toEqual("X");

        jest.advanceTimersByTime(1000);

        expect(wrapper.vm.blocks[2]).not.toEqual("X");
    });

    it('handles the cash out button correctly', () => {
        const wrapper = mount(SlotMachine, {
            data() {
                return {
                    credits: 10
                }
            }
        })

        jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock the window.alert method

        const cashOutButton = wrapper.find('.cash-out')
        cashOutButton.trigger('click')
        expect(wrapper.vm.credits).toBe(0)

        window.alert.mockRestore(); // Restore the original window.alert method
    });

    it('displays an alert and does nothing if the user has no credits', () => {
        const wrapper = mount(SlotMachine, {
            data() {
                return {
                    credits: 0
                }
            }
        });
        const cashOutButton = wrapper.find('.cash-out');
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        cashOutButton.trigger('mouseover');
        expect(alertSpy).toHaveBeenCalledWith("You don't have any credits to cash out!");
        expect(cashOutButton.element.style.transform).toBe('');
        expect(cashOutButton.element.style.pointerEvents).toBe('');
        alertSpy.mockRestore();
    });

    it('randomly moves the button in a random direction by 300px with a 50% chance', async () => {
        const wrapper = mount(SlotMachine);
        const cashOutButton = wrapper.find('.cash-out').element;
        const originalTransform = cashOutButton.style.transform;
        // Call the function 10 times and check that the button has moved at least once
        for (let i = 0; i < 10; i++) {
            wrapper.vm.handleCashOutHover();
            await wrapper.vm.$nextTick();
            const newTransform = cashOutButton.style.transform;
            if (newTransform !== originalTransform) {
                // The button has moved
                return;
            }
        }
        fail('The button did not move');
    });

    it('makes the button unclickable with a 40% chance', async () => {
        const wrapper = mount(SlotMachine);
        const cashOutButton = wrapper.find('.cash-out').element;
        // Call the function 10 times and check that the button is unclickable at least once
        for (let i = 0; i < 10; i++) {
            wrapper.vm.handleCashOutHover();
            await wrapper.vm.$nextTick();
            if (cashOutButton.style.pointerEvents === 'none') {
                // The button is unclickable
                return;
            }
        }
        fail('The button is still clickable');
    });

    it('returns the expected percentage of true values', () => {
        const wrapper = mount(SlotMachine);
        const creditValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const numIterations = 1000;
        const expectedPercentages = {
            0: 0,
            10: 0,
            20: 0,
            30: 0,
            40: 0.3,
            50: 0.3,
            60: 0.6,
            70: 0.6,
            80: 0.6,
            90: 0.6,
            100: 0.6
        };// define the expected percentage of true values for each credit value
        for (const creditValue of creditValues) {
            let numTrueValues = 0;
            for (let i = 0; i < numIterations; i++) {
                const result = wrapper.vm.shouldReroll(creditValue);
                if (result) {
                    numTrueValues++;
                }
            }
            const actualPercentage = numTrueValues / numIterations;
            const expectedPercentage = expectedPercentages[creditValue];
            expect(actualPercentage).toBeCloseTo(expectedPercentage, 1);
        }
    });
})
