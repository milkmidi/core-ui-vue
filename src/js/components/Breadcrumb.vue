<template>
  <ol class="breadcrumb">
    <li class="breadcrumb-item" v-for="(item, index) in list"><span class="active" v-if="isLast(index)">{{ showName(item) }}</span>
      <router-link :to="item.path" v-else>{{ showName(item) }}</router-link>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    isLast(index) {
      return index === this.list.length - 1;
    },
    showName(item) {
      let newItem;
      if (item.meta && item.meta.label) {
        newItem = item.meta && item.meta.label;
      }
      if (item.name) {
        newItem = item.name;
      }
      return newItem;
    },
  },
};
</script>
