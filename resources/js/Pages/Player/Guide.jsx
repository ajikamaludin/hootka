import React from "react";
import guide1 from '@/Assets/guide/1.png';
import guide2 from '@/Assets/guide/2.png';
import guide3 from '@/Assets/guide/3.png';
import guide4 from '@/Assets/guide/4.png';
import guide5 from '@/Assets/guide/5.png';

export default function Guide({ isOpen, toggle }) {
    
    return (
        <div
            className="modal modal-bottom sm:modal-middle pb-10"
            style={
                isOpen
                    ? {
                        opacity: 1,
                        pointerEvents: 'auto',
                        visibility: 'visible',
                        overflowY: 'initial',
                    }
                    : {}
            }
        >
            <div className="modal-box overflow-y-auto max-h-screen text-center">
                <div className='font-bold text-2xl text-yellow-400'>
                    Petunjuk Permainan
                </div>
                <div className="carousel max-w-md p-4 space-x-4 rounded-box h-96">
                    <div id="item1" className="carousel-item">
                        <img src={guide1} className="rounded-box object-fit" />
                    </div>
                    <div id="item2" className="carousel-item">
                        <img src={guide2} className="rounded-box object-fit" />
                    </div>
                    <div id="item3" className="carousel-item">
                        <img src={guide3} className="rounded-box object-fit" />
                    </div>
                    <div id="item4" className="carousel-item">
                        <img src={guide4} className="rounded-box object-fit" />
                    </div>
                    <div id="item5" className="carousel-item">
                        <img src={guide5} className="rounded-box object-fit" />
                    </div> 
                </div>
                <div className="flex justify-center w-full py-2 gap-2">
                    <a href="#item1" className="btn btn-xs">1</a> 
                    <a href="#item2" className="btn btn-xs">2</a> 
                    <a href="#item3" className="btn btn-xs">3</a> 
                    <a href="#item4" className="btn btn-xs">4</a>
                    <a href="#item5" className="btn btn-xs">5</a>
                </div>
                <div className="modal-action">
                    <div 
                        className='btn btn-secondary'
                        onClick={() => toggle()}
                    >
                        Close
                    </div>
                </div>
            </div>
        </div>
    )
}