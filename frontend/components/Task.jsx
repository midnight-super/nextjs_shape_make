const { default: TaskModal } = require("./TaskModal");

function Task({ task }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex items-center w-full shadow-md p-4 border-l-8 border-l-[#ABC502] cursor-pointer`}
      onClick={() => {
        setIsOpen(true);
      }}
    >
      <div className="mr-8">
        <input type="checkbox" checked={task.completed} disabled />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="text-lg font-semibold">Task Name: {task.name}</div>
        <div>Task Desc: {task.description}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Customer: </div>
        <div>{task.customerAssignedTo?.customerName}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Assigned To: </div>
        {/* <div>{task.customerAssignedTo?.customerName}</div> */}
        <div>{task.teamMemberAssignedTo?.email}</div>
      </div>
      <div className="flex flex-col gap-1 w-2/12">
        <div className="text-lg font-semibold">Complete By: </div>
        <div className="">
          {new Date(task.completionDate).toLocaleDateString("en-UK", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
      <TaskModal isOpen={isOpen} setIsOpen={setIsOpen} task={task} />
    </div>
  );
}
