/**
 * Created by sean on 22/12/16.
 */
import React from 'react'

class DetailTable extends React.Component {
    render() {
        let items = this.props.items || [];
        let rows = items.map(i => {
            return <tr key={i[0]}>
                <th>{i[0]}</th>
                <td>{i[1]}</td>
            </tr>
        })

        return <table className="table table-striped">
            <tbody>
                {rows}
            </tbody>
        </table>
    }
}

export default DetailTable;