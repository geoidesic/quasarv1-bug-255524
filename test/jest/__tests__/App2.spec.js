import { QBtn } from "quasar";

import QBtnDemo from "./demo/QBtn-demo";
import { mountQuasar } from "@quasar/quasar-app-extension-testing-unit-jest";

describe("Mount Quasar", () => {
  const wrapper = mountQuasar(QBtnDemo, {
    quasar: { components: { QBtn } },
    mount: { type: "full" } // <--------- This changes the mount function used
  });
  const vm = wrapper.vm;

  it("has a created hook", () => {
    expect(typeof vm.increment).toBe("function");
  });

  it("accesses the shallowMount", () => {
    expect(vm.$el.textContent).toContain("rocket muffin");
    expect(wrapper.text()).toContain("rocket muffin"); // easier
    expect(wrapper.find("p").text()).toContain("rocket muffin");
  });

  it("sets the correct default data", () => {
    expect(typeof vm.counter).toBe("number");
    const defaultData = vm.$data;
    expect(defaultData.counter).toBe(0);
  });

  it("correctly updates data when button is pressed", async () => {
    const button = wrapper.find("button");
    await button.trigger("click");
    expect(vm.counter).toBe(1);
  });
});
