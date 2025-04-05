import React from "react";
import { Handle, Position } from "@xyflow/react";

const CustomNode = ({ data }) => {
    const { handleoncick, title } = data;
    return (
        <div >
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-gray-600 rounded-full cursor-grab -top-1" />
            <button
                onClick={handleoncick}
                className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 active:bg-amber-600 text-sm"
            >
                {title}
            </button>
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-gray-600 rounded-full cursor-grab -bottom-1" />
        </div>
    );
};

export default CustomNode;