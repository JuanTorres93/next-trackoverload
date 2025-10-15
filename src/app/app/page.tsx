import Input from '../_ui/Input';
import Form from '../_ui/NewResourceForm';

export default function Home() {
  return (
    <div className="">
      <main className="">app page</main>
      <Form>
        <Form.FormRow label="Input1">
          <Input id="input1" />
        </Form.FormRow>

        <Form.FormRow label="Input2">
          <Input id="input2" />
        </Form.FormRow>

        <Form.FormRow label="Input3">
          <Input id="input3" placeholder="Enter text" />
        </Form.FormRow>
      </Form>
    </div>
  );
}
