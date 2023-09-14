/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderSlot, useSlots, watchEffect } from 'vue';
import { Col, Row, Skeleton } from 'vant';
// import styleModule from './index.module.scss';
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

const createSlots = (str: string): SlotItem =>
  str.split(':').reduce(
    (prev, curr, index) => {
      prev[`slot${index}`] = {
        key: `slot${index}`,
        span: curr,
        children: [],
      };
      return prev;
    },
    { value: str },
  );

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

    return () => (
      <div
        ref={(el) => registerRef(el, block._vid)}
        {...custom}
        {...props}
        style={{
          ...styles,
          background: `url(${props.background})`,
          'background-size': '100% 100%',
          height: 'fit-content',
        }}
      >
        {Array.from({ length: props.row }, (_, index) => {
          slotsTemp[block._vid][`slot${index}`] = <></>;
          return (
            <>
              <Row style={{ height: '100px' }} key={index}>
                {renderSlot(slots, `slot${index}`)}
              </Row>
            </>
          );
        })}
        {/*
        <Row ref={(el) => registerRef(el, block._vid)} {...custom} {...props}>
          {Object.values(Object.keys(props.slots).length ? props.slots : createSlots('12:12'))
            ?.filter((item) => typeof item !== 'string')
            .map((spanItem: SlotItem, spanIndex) => {
              slotsTemp[block._vid][`slot${spanIndex}`] = spanItem;
              return (
                <>
                  <Col span={spanItem.span}>{renderSlot(slots, `slot${spanIndex}`)}</Col>
                </>
              );
            })}
        </Row>
        */}
      </div>
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
