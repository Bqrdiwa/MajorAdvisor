import BaseAuth from "../auth/Base";

export default function Profile() {
  return (
    <div className="lg:p-8 relative h-full flex flex-col lg:rounded-4xl">
      <BaseAuth getsummery={true} canLogin={false} />
    </div>
  );
}
