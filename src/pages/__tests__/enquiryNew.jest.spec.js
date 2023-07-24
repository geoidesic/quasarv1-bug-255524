import EnquiryNew from "../enquiryNew";
// import EnquiryForm from "components/enquiry/EnquiryForm";
import { mountQuasar } from "@quasar/quasar-app-extension-testing-unit-jest";
import { QPage } from "quasar";
import * as All from "quasar";

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

/**
 * @todo: errors here are caused by MultiChipSet
 */
describe("`New` route and context", () => {
  const wrapper = mountQuasar(EnquiryNew, {
    quasar: { components }
    // mount: { type: "full" } // <--------- This changes the mount function used
  });
  const vm = wrapper.vm;
  it("should mount", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });
  it("has a created hook", () => {
    expect(typeof vm.selectedTestRecord).toBe("object");
  });
});
