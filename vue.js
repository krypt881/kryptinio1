Vue.component('task-list', {
  template: '#task-list',
  props: {
    tasks: {default: []}
  },
  data() {
    return {
      newTask: ''
    };
  },
  methods: {
    addTask() {
      if (this.newTask) {
        this.tasks.push({
          title: this.newTask,
          completed: false
        });
        this.newTask = '';
      }
    },
    completeTask(task) {
      task.completed = ! task.completed;
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
    }
  }
});
Vue.component('task-item', {
  template: '#task-item',
  props: ['task'],
  computed: {
    className() {
      let classes = ['tasks__item__toggle'];
      if (this.task.completed) {
        classes.push('tasks__item__toggle--completed');
      }
      return classes.join(' ');
    }
  }
});
let app = new Vue({
  el: '#app',
  data: {
    tasks: []
  },
  flag_rewrite: false,
  watch: {
    tasks: { 
      handler: function (newVal) {
        if (this.flag_rewrite){
          axios({
            method: 'post',
            url: '/todo-checklist/ajax.php',
            data: {
              action: 'set-storage',
              'data-storage': JSON.stringify(newVal)
            }
          })
          .then(function (response) {
            if (response.data == 'error'){
              alert('Ошибка: не удалось сохранить данные');
            }
          })

        }
        if (!this.flag_rewrite) this.flag_rewrite = true;
      },
      deep: true
    }  
  }
});
document.addEventListener('DOMContentLoaded', function(){
  axios({
    method: 'post',
    url: '/todo-checklist/ajax.php',
    data: {
      action: 'get-storage'
    }
  })
  .then(function (response) {
    data = response.data;
    if (data !== 'error'){
      app.tasks = data;
    } else {
      alert('Ошибка: не удалось загрузить данные');
    }
  })

});
