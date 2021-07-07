import { toast } from "react-toastify";
export const notify = {
  success,
  successBottom,
  error,
  errorBottom,
  warn,
  warnBottom,
  infoBottom,
  info
};
function scrollToTop() {
  window.scrollTo(0, 0);
}
function success(text) {
  toast.success(text, {
    position: toast.POSITION.TOP_RIGHT
  });
  scrollToTop();
}
function successBottom(text) {
  toast.success(text, {
    position: toast.POSITION.BOTTOM_RIGHT
  });
}
function error(text) {
  toast.error(text, {
    position: toast.POSITION.TOP_RIGHT
  });
  scrollToTop();
}
function errorBottom(text) {
  toast.error(text, {
    position: toast.POSITION.BOTTOM_RIGHT
  });
}
function warn(text) {
  toast.warn(text, {
    position: toast.POSITION.TOP_RIGHT
  });
  scrollToTop();
}
function warnBottom(text) {
  toast.warn(text, {
    position: toast.POSITION.BOTTOM_RIGHT
  });
}
// function warn(text) {
// 	toast.warn(text, {
// 		position: toast.POSITION.TOP_RIGHT,
// 	});
// 	scrollToTop();
// }
function infoBottom(text) {
  toast.info(text, {
    position: toast.POSITION.BOTTOM_RIGHT
  });
}
function info(text) {
  toast.info(text, {
    position: toast.POSITION.TOP_RIGHT
  });
  scrollToTop();
}
