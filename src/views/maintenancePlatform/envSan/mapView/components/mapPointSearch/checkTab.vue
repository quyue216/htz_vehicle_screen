<template>
  <div class="check-container">
    <span
      :label="item.label"
      v-for="(item, index) in typeList"
      :key="index"
      @click="handClick(item)"
      class="check"
      :class="{
        active: activeLabel === item.label,
        disabled: !!item.disabled,
      }"
    >
      {{ item.label }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  typeList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:activeLabel", "handClick"]);
// 激活label
const activeLabel = defineModel('activeLabel',{
  required: true,
})
const handClick = (item) => {
  if (!item.disabled) {
    activeLabel.value = item.label;
    emit("handClick", item);
  }
};
</script>

<style scoped lang="scss">
.check-container {
  display: flex;
}

.check {
  padding: 7px 10px;
  font-size: 14px;
  text-align: center;
  // display: inline-block;
  color: #fff;
  text-wrap: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  border-right: 1px solid #3cdff1;
  border-top: 1px solid #3cdff1;
  border-bottom: 1px solid #3cdff1;
  // 禁止选择
  user-select: none;
  transition: 0.3s;
  &:first-child {
    border-left: 1px solid #3cdff1;
    border-radius: 4px 0 0 4px;
  }
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  &:hover {
    color: #3dddf2;
  }
  &.active {
    color: #fff;
    background-color: #409eff;
  }
  &.disabled {
    color: #c0c4cc;
    border-color: #ebeef5;
    cursor: not-allowed;
  }
}
</style>
