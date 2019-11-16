export default {
  state: {
    userForm: {
      id: null,
      username: '',
      name: '',
      mobile: null,
      email: null,
      roles: [],
      department: null,
      superior: null,
      is_active: true,
      is_staff: false,
      is_superuser: false
    },
    type: 'create',
    modal: false
  },
  mutations: {
    setID (state, ID) {
      state.userForm.id = ID
    },
    setUsername (state, Username) {
      state.userForm.username = Username
    },
    setName (state, Name) {
      state.userForm.name = Name
    },
    setMobile (state, Mobile) {
      state.userForm.mobile = Mobile
    },
    setEmail (state, Email) {
      state.userForm.email = Email
    },
    setRoles (state, Roles) {
      state.userForm.roles = Roles
    },
    setDepartment (state, Department) {
      state.userForm.department = Department
    },
    setSuperior (state, Superior) {
      state.userForm.superior = Superior
    },
    setIs_active (state, is_Active) {
      state.userForm.is_active = is_Active
    },
    setIs_staff (state, is_Staff) {
      state.userForm.is_staff = is_Staff
    },
    setIs_superuser (state, is_Superuser) {
      state.userForm.is_superuser = is_Superuser
    },
    setType (state, Type) {
      state.type = Type
    },
    setModal (state, Modal) {
      state.modal = Modal
    }
  },
  action: {
  }
}
