const hasPermission = {
  install (Vue, options) {
    Vue.directive('has', {
      inserted (el, binding, vnode) {
        let permTypes = vnode.context.$route.meta.permTypes;
        if (permTypes && !permTypes.includes(binding.value)) {
          el.parentNode.removeChild(el);
        }
      }
    });
  }
};

export default hasPermission

// export const hasPermission = {
//   install (Vue) {
//     Vue.directive('hasPermission', {
//       bind (el, binding, vnode) {
//         let permTypes = vnode.context.$route.meta.permTypes;
//         let value = binding.value.split(',');
//         let flag = true;
//         for (let v of value) {
//           if (!permTypes.includes(v)) {
//             flag = false
//           }
//         }
//         if (!flag) {
//           el.parentNode.removeChild(el)
//         }
//       }
//     })
//   }
// };
//
// export default hasPermission
