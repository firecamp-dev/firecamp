import { Tabs, ScrollArea } from '@firecamp/ui';
import { ForgetPasswordForm } from '../form/Form.stories';

export default {
  title: 'UI-Kit/ScrollArea',
  component: ScrollArea,
};

export const Demo = () => (
  <div className="m-4 p-8 border border-app-foreground w-fit">
    <ScrollArea w={200} h={200}>
      <div className="text-lg font-medium">Content Heading</div>
      <hr />
      {Array(20)
        .fill(1)
        .map((tag, i) => (
          <div className="text-sm mt-2 pt-3" key={tag + i}>
            {tag + i}. &nbsp; "In publishing and graphic design, Lorem ipsum is
            a placeholder text commonly used to demonstrate the visual form of a
            document or a typeface without relying on meaningful content. " "In
            publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. "
          </div>
        ))}
    </ScrollArea>
  </div>
);

export const VerticalScroll = () => (
  <div className="m-4 p-4 border border-app-foreground h-80 max-w-xs">
    <ScrollArea>
      {/* <div className="max-w-sm"> */}
      <div className="text-lg font-medium">Content Heading</div>
      <hr />
      {Array(20)
        .fill(1)
        .map((tag, i) => (
          <div className="text-sm mt-2 pt-3 truncate" key={tag + i}>
            {tag + i}. &nbsp; "In publishing and graphic design, Lorem ipsum is
            a placeholder text commonly used to demonstrate the visual form of a
            document or a typeface without relying on meaningful content. " "In
            publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. "
          </div>
        ))}
      {/* </div> */}
    </ScrollArea>
  </div>
);

export const HorizontalScroll = () => (
  <div className="m-4 p-4 border border-app-foreground max-w-xs">
    <ScrollArea>
      <div className="text-lg font-medium">Content Heading</div>
      <hr />
      {Array(3)
        .fill(1)
        .map((tag, i) => (
          <div className="text-sm mt-2 pt-3" key={tag + i}>
            {tag + i}. &nbsp; "In publishing and graphic design, Lorem ipsum is
            a placeholder text commonly used to demonstrate the visual form of a
            document or a typeface without relying on meaningful content. " "In
            publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. "
          </div>
        ))}
    </ScrollArea>
  </div>
);

export const ScrollAreaWithModal = () => (
  <div className="m-4 p-4 border border-app-foreground ">
    <ScrollArea h={200}>
      <ForgetPasswordForm />
      <br />
    </ScrollArea>
  </div>
);

export const RequestTabExample = () => (
  <div className="m-4 p-8 border border-app-foreground w-fit max-w-xs">
    <ScrollArea>
      <Tabs
        list={[
          {
            id: 'body',
            name: 'Body',
          },
          {
            id: 'auth',
            name: 'Auth',
          },
          {
            id: 'header',
            name: 'Header',
          },
          {
            id: 'param',
            name: 'Param',
          },
          {
            id: 'scripts',
            name: 'Scripts',
          },
        ]}
        activeTab={'header'}
        onSelect={() => {}}
      />
    </ScrollArea>
  </div>
);
