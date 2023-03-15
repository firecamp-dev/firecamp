import ScrollBar from './ScrollBar';

export default {
  title: 'UI-Kit/ScrollBar',
  component: ScrollBar,
  argTypes: {
    className: '',
  },
};

export const Demo = () => (
  <ScrollBar>
    <div style={{ padding: '15px 20px' }}>
      <div className="text-lg font-medium">Tags</div>
      <hr />
      {[
        'TAGS 1',
        'TAGS 2',
        'TAGS 3',
        'TAGS 4',
        'TAGS 5',
        'TAGS 6',
        'TAGS 7',
        'TAGS 1.0',
        'TAGS 2.0',
        'TAGS 3.0',
        'TAGS 4.0',
        'TAGS 5.0',
        'TAGS 6.0',
        'TAGS 7.0',
        'TAGS 1.1',
        'TAGS 2.1',
        'TAGS 3.1',
        'TAGS 4.1',
        'TAGS 5.1',
        'TAGS 6.1',
        'TAGS 7.1',
      ].map((tag) => (
        <div className="text-sm mt-2 pt-3" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  </ScrollBar>
);
