export function ConcessionEditBody({item, eventKey}) {
    return (
        <div>
            {`Concession ${item.ConcessionID}: 
            Opens ${item.OpensAt} 
            OpenFor ${item.OpenDuration} 
            Located@ ${item.Location}`}
        </div>
    );
}