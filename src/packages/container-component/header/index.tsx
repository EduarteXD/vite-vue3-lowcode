import { renderSlot, useSlots, watchEffect } from 'vue';
import { Col, Row, Skeleton } from 'vant';
import styleModule from './index.module.scss';
import type { VisualEditorComponent } from '@/visual-editor/visual-editor.utils';
import {
  createEditorInputNumberProp,
  createEditorInputProp,
} from '@/visual-editor/visual-editor.props';
import { useGlobalProperties } from '@/hooks/useGlobalProperties';

interface SlotItem {
  value: string;
  [prop: string]: any;
}

const slotsTemp = {} as any;

const createSlots = (num: number): SlotItem => {
  const res = { value: '24' } as SlotItem;
  for (let i = 0; i < num; i++) {
    res[`slot${i}`] = {
      children: [],
      key: `slot${i}`,
      span: '24',
    };
  }
  return res;
};

export default {
  key: 'header',
  moduleName: 'containerComponents',
  label: '头部容器',
  preview: () => (
    <div>
      <Row gutter="20">
        <Col span="4">
          <Skeleton title avatar></Skeleton>
        </Col>
        <Col span="4">
          <Skeleton title avatar></Skeleton>
        </Col>
        <Col span="4">
          <Skeleton title avatar></Skeleton>
        </Col>
        <Col span="4">
          <Skeleton title avatar></Skeleton>
        </Col>
        <Col span="4">
          <Skeleton title avatar></Skeleton>
        </Col>
      </Row>
      <Row></Row>
    </div>
  ),
  render: ({ props, styles, block, custom }) => {
    const slots = useSlots();
    const { registerRef } = useGlobalProperties();

    slotsTemp[block._vid] ??= {};

    watchEffect(() => {
      if (Object.keys(props.slots || {}).length) {
        Object.entries<SlotItem>(props.slots).forEach(([key, slot]) => {
          if (slotsTemp[block._vid][key]?.children) {
            slot.children = slotsTemp[block._vid][key].children;
          }
        });
      }
    });

    watchEffect(() => {
      props.slots = createSlots(props.row);
    }, props.row);

    return () => (
      <Row
        ref={(el) => registerRef(el, block._vid)}
        {...custom}
        {...props}
        class={styleModule.vanRow}
        style={{
          ...styles,
          background: `url(${props.background})`,
          'background-size': '100% 100%',
          height: 'fit-content',
        }}
      >
        {Array.from({ length: props.row }, (_, index) => {
          return (
            <>
              <Col span="24" key={index}>
                {renderSlot(slots, `slot${index}`)}
              </Col>
            </>
          );
        })}
      </Row>
    );
  },
  resize: {
    height: true,
    width: true,
  },
  props: {
    background: createEditorInputProp({
      label: '背景图片',
      defaultValue: 'https://img.yzcdn.cn/vant/cat.jpeg',
    }),
    row: createEditorInputNumberProp({
      label: '行数',
      defaultValue: 2,
      min: 1,
    }),
  },
} as VisualEditorComponent;
