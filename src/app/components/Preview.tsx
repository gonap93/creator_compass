'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Card {
  id: string;
  content: string;
  tag: 'idea' | 'filming';
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export default function Preview() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'column-1',
      title: 'Ideas',
      cards: [],
    },
    {
      id: 'column-2',
      title: 'Filming',
      cards: [],
    },
  ]);

  useEffect(() => {
    // Create initial card after 1 second
    const createCard = setTimeout(() => {
      const newCard: Card = {
        id: 'card-1',
        content: 'Create a new video about AI trends',
        tag: 'idea'
      };
      
      setColumns(prev => prev.map(col => 
        col.id === 'column-1' 
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ));
    }, 1000);

    // Move card to Filming after 3 seconds
    const moveToFilming = setTimeout(() => {
      setColumns(prev => {
        const ideaColumn = prev.find(col => col.id === 'column-1');
        const filmingColumn = prev.find(col => col.id === 'column-2');
        const card = ideaColumn?.cards[0];

        if (!card) return prev;

        return prev.map(col => {
          if (col.id === 'column-1') {
            return { ...col, cards: [] };
          }
          if (col.id === 'column-2') {
            return { 
              ...col, 
              cards: [{ ...card, tag: 'filming' }] 
            };
          }
          return col;
        });
      });
    }, 3000);

    return () => {
      clearTimeout(createCard);
      clearTimeout(moveToFilming);
    };
  }, []);

  return (
    <div className="p-4">
      <DragDropContext onDragEnd={() => {}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-gray-100 rounded-lg p-4 min-h-[500px]"
            >
              <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {column.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col gap-2">
                              <p>{card.content}</p>
                              <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                                card.tag === 'idea' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {card.tag.charAt(0).toUpperCase() + card.tag.slice(1)}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 