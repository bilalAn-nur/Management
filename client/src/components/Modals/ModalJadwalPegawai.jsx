import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const employees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

const ModalJadwalPegawai = ({ date, onSave, onClose }) => {
  const [schedule, setSchedule] = useState({
    morning: [],
    shift: [],
    dayOff: [],
  });

  const handleDrop = (employee, type) => {
    setSchedule((prev) => ({
      ...prev,
      [type]: [...prev[type], employee],
    }));
  };

  const DraggableEmployee = ({ employee }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "EMPLOYEE",
      item: employee,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`p-2 border ${isDragging ? "opacity-50" : ""}`}
      >
        {employee.name}
      </div>
    );
  };

  const DroppableArea = ({ type, children }) => {
    const [, drop] = useDrop({
      accept: "EMPLOYEE",
      drop: (item) => handleDrop(item, type),
    });

    return (
      <div ref={drop} className="p-4 border rounded-lg min-h-[100px]">
        {children}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          Schedule for {date} September
        </h2>
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <DroppableArea type="morning">
              <h3 className="font-semibold">Morning</h3>
              {schedule.morning.map((emp) => (
                <div key={emp.id}>{emp.name}</div>
              ))}
            </DroppableArea>
            <DroppableArea type="shift">
              <h3 className="font-semibold">Shift</h3>
              {schedule.shift.map((emp) => (
                <div key={emp.id}>{emp.name}</div>
              ))}
            </DroppableArea>
            <DroppableArea type="dayOff">
              <h3 className="font-semibold">Day Off</h3>
              {schedule.dayOff.map((emp) => (
                <div key={emp.id}>{emp.name}</div>
              ))}
            </DroppableArea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {employees.map((employee) => (
              <DraggableEmployee key={employee.id} employee={employee} />
            ))}
          </div>
        </DndProvider>
        <div className="mt-4">
          <button
            onClick={() => onSave(date)}
            className="mr-2 bg-blue-500 text-white p-2 rounded-lg"
          >
            Save
          </button>
          <button onClick={onClose} className="bg-gray-300 p-2 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalJadwalPegawai;
