export const baseMailTemplate = (
  header: string,
  cardHeader: string,
  content: string,
  reservationId: number,
) => `
<div id=":mw" class="ii gt"
  jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3NzkwMDc2ODcwNzQ5MDg4NiIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NzkwMDc2ODcwNzQ5MDg4NiIsbnVsbCxbXSxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxbXSxbXSxbXV0.">
  <div id=":mv" class="a3s aiL">
    <u></u>

    <div style="
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
            Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
          font-size: 14px;
          line-height: 1.5;
          color: #24292e;
          background-color: #fff;
          margin: 0;
        " bgcolor="#fff">
      <table align="center" width="100%" style="
            box-sizing: border-box;
            border-spacing: 0;
            border-collapse: collapse;
            max-width: 544px;
            margin-right: auto;
            margin-left: auto;
            width: 100% !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
              Helvetica, Arial, sans-serif, 'Apple Color Emoji',
              'Segoe UI Emoji' !important;
          ">
        <tbody>
          <tr style="
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                  Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                  'Segoe UI Emoji' !important;
              ">
            <td align="center" valign="top" style="
                  box-sizing: border-box;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                    'Segoe UI Emoji' !important;
                  padding: 16px;
                ">
              <center style="
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                      Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                      'Segoe UI Emoji' !important;
                  ">
                <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="
                      box-sizing: border-box;
                      border-spacing: 0;
                      border-collapse: collapse;
                      max-width: 768px;
                      margin-right: auto;
                      margin-left: auto;
                      width: 100% !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji' !important;
                    ">
                  <tbody>
                    <tr style="
                          box-sizing: border-box;
                          font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Helvetica, Arial, sans-serif,
                            'Apple Color Emoji', 'Segoe UI Emoji' !important;
                        ">
                      <td align="center" style="
                            box-sizing: border-box;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            padding: 0;
                          ">
                        <table style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              ">
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td height="16" style="
                                    font-size: 16px;
                                    line-height: 16px;
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table border="0" cellspacing="0" cellpadding="0" align="left" width="100%" style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody>
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td style="
                                    box-sizing: border-box;
                                    text-align: left !important;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  " align="left">
                                <img src="https://avatars.githubusercontent.com/u/134249339?s=64&v=4" alt="GitHub"
                                  width="32" style="
                                      box-sizing: border-box;
                                      font-family: -apple-system,
                                        BlinkMacSystemFont, 'Segoe UI',
                                        Helvetica, Arial, sans-serif,
                                        'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                      border-style: none;
                                    " class="CToWUd" data-bit="iit" />
                                <h2 style="
                                      box-sizing: border-box;
                                      margin-top: 8px !important;
                                      margin-bottom: 0;
                                      font-size: 24px;
                                      font-weight: 400 !important;
                                      line-height: 1.25 !important;
                                      font-family: -apple-system,
                                        BlinkMacSystemFont, 'Segoe UI',
                                        Helvetica, Arial, sans-serif,
                                        'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                    ">
                                  ${header}
                                </h2>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              ">
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td height="16" style="
                                    font-size: 16px;
                                    line-height: 16px;
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" style="
                      box-sizing: border-box;
                      border-spacing: 0;
                      border-collapse: collapse;
                      width: 100% !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji' !important;
                    ">
                  <tbody>
                    <tr style="
                          box-sizing: border-box;
                          font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Helvetica, Arial, sans-serif,
                            'Apple Color Emoji', 'Segoe UI Emoji' !important;
                        ">
                      <td style="
                            box-sizing: border-box;
                            border-radius: 6px !important;
                            display: block !important;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            padding: 0;
                            border: 1px solid #e1e4e8;
                          ">
                        <table align="center" style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              width: 100% !important;
                              text-align: center !important;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody>
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td style="
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="
                                      box-sizing: border-box;
                                      border-spacing: 0;
                                      border-collapse: collapse;
                                      width: 100% !important;
                                      font-family: -apple-system,
                                        BlinkMacSystemFont, 'Segoe UI',
                                        Helvetica, Arial, sans-serif,
                                        'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                    ">
                                  <tbody>
                                    <tr style="
                                          box-sizing: border-box;
                                          font-family: -apple-system,
                                            BlinkMacSystemFont, 'Segoe UI',
                                            Helvetica, Arial, sans-serif,
                                            'Apple Color Emoji',
                                            'Segoe UI Emoji' !important;
                                        ">
                                      <td align="center" style="
                                            box-sizing: border-box;
                                            font-family: -apple-system,
                                              BlinkMacSystemFont, 'Segoe UI',
                                              Helvetica, Arial, sans-serif,
                                              'Apple Color Emoji',
                                              'Segoe UI Emoji' !important;
                                            padding: 0;
                                          ">
                                        <table align="center" style="
                                              box-sizing: border-box;
                                              border-spacing: 0;
                                              border-collapse: collapse;
                                              border-bottom-width: 1px !important;
                                              border-bottom-color: #e1e4e8 !important;
                                              border-bottom-style: solid !important;
                                              width: 100% !important;
                                              text-align: center !important;
                                              font-family: -apple-system,
                                                BlinkMacSystemFont, 'Segoe UI',
                                                Helvetica, Arial, sans-serif,
                                                'Apple Color Emoji',
                                                'Segoe UI Emoji' !important;
                                            ">
                                          <tbody>
                                            <tr style="
                                                  box-sizing: border-box;
                                                  font-family: -apple-system,
                                                    BlinkMacSystemFont,
                                                    'Segoe UI', Helvetica, Arial,
                                                    sans-serif,
                                                    'Apple Color Emoji',
                                                    'Segoe UI Emoji' !important;
                                                ">
                                              <td style="
                                                    box-sizing: border-box;
                                                    display: block !important;
                                                    font-family: -apple-system,
                                                      BlinkMacSystemFont,
                                                      'Segoe UI', Helvetica,
                                                      Arial, sans-serif,
                                                      'Apple Color Emoji',
                                                      'Segoe UI Emoji' !important;
                                                    padding: 24px;
                                                  ">
                                                <table border="0" cellspacing="0" cellpadding="0" align="center"
                                                  width="100%" style="
                                                      box-sizing: border-box;
                                                      border-spacing: 0;
                                                      border-collapse: collapse;
                                                      width: 100% !important;
                                                      font-family: -apple-system,
                                                        BlinkMacSystemFont,
                                                        'Segoe UI', Helvetica,
                                                        Arial, sans-serif,
                                                        'Apple Color Emoji',
                                                        'Segoe UI Emoji' !important;
                                                    ">
                                                  <tbody>
                                                    <tr style="
                                                          box-sizing: border-box;
                                                          font-family: -apple-system,
                                                            BlinkMacSystemFont,
                                                            'Segoe UI',
                                                            Helvetica, Arial,
                                                            sans-serif,
                                                            'Apple Color Emoji',
                                                            'Segoe UI Emoji' !important;
                                                        ">
                                                      <td align="center" style="
                                                            box-sizing: border-box;
                                                            font-family: -apple-system,
                                                              BlinkMacSystemFont,
                                                              'Segoe UI',
                                                              Helvetica, Arial,
                                                              sans-serif,
                                                              'Apple Color Emoji',
                                                              'Segoe UI Emoji' !important;
                                                            padding: 0;
                                                          ">
                                                        <table style="
                                                              box-sizing: border-box;
                                                              border-spacing: 0;
                                                              border-collapse: collapse;
                                                              font-family: -apple-system,
                                                                BlinkMacSystemFont,
                                                                'Segoe UI',
                                                                Helvetica, Arial,
                                                                sans-serif,
                                                                'Apple Color Emoji',
                                                                'Segoe UI Emoji' !important;
                                                            ">
                                                          <tbody style="
                                                                box-sizing: border-box;
                                                                font-family: -apple-system,
                                                                  BlinkMacSystemFont,
                                                                  'Segoe UI',
                                                                  Helvetica,
                                                                  Arial,
                                                                  sans-serif,
                                                                  'Apple Color Emoji',
                                                                  'Segoe UI Emoji' !important;
                                                              ">
                                                            <tr style="
                                                                  box-sizing: border-box;
                                                                  font-family: -apple-system,
                                                                    BlinkMacSystemFont,
                                                                    'Segoe UI',
                                                                    Helvetica,
                                                                    Arial,
                                                                    sans-serif,
                                                                    'Apple Color Emoji',
                                                                    'Segoe UI Emoji' !important;
                                                                ">
                                                              <td height="12" style="
                                                                    font-size: 12px;
                                                                    line-height: 12px;
                                                                    box-sizing: border-box;
                                                                    font-family: -apple-system,
                                                                      BlinkMacSystemFont,
                                                                      'Segoe UI',
                                                                      Helvetica,
                                                                      Arial,
                                                                      sans-serif,
                                                                      'Apple Color Emoji',
                                                                      'Segoe UI Emoji' !important;
                                                                    padding: 0;
                                                                  ">
                                                                &nbsp;
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>

                                                        <h3 style="
                                                              box-sizing: border-box;
                                                              margin-top: 0;
                                                              margin-bottom: 0;
                                                              font-size: 20px;
                                                              font-weight: 600;
                                                              line-height: 1.25 !important;
                                                              font-family: -apple-system,
                                                                BlinkMacSystemFont,
                                                                'Segoe UI',
                                                                Helvetica, Arial,
                                                                sans-serif,
                                                                'Apple Color Emoji',
                                                                'Segoe UI Emoji' !important;
                                                            ">
                                                          ${cardHeader}
                                                        </h3>
                                                        <br />
                                                        <br style="
                                                                box-sizing: border-box;
                                                                font-family: -apple-system,
                                                                  BlinkMacSystemFont,
                                                                  'Segoe UI',
                                                                  Helvetica,
                                                                  Arial,
                                                                  sans-serif,
                                                                  'Apple Color Emoji',
                                                                  'Segoe UI Emoji' !important;
                                                              " />
                                                        ${content}
                                                        <br style="
                                                                box-sizing: border-box;
                                                                font-family: -apple-system,
                                                                  BlinkMacSystemFont,
                                                                  'Segoe UI',
                                                                  Helvetica,
                                                                  Arial,
                                                                  sans-serif,
                                                                  'Apple Color Emoji',
                                                                  'Segoe UI Emoji' !important;
                                                              " />
                                                       
                                                        <table style="
                                                              box-sizing: border-box;
                                                              border-spacing: 0;
                                                              border-collapse: collapse;
                                                              font-family: -apple-system,
                                                                BlinkMacSystemFont,
                                                                'Segoe UI',
                                                                Helvetica, Arial,
                                                                sans-serif,
                                                                'Apple Color Emoji',
                                                                'Segoe UI Emoji' !important;
                                                            ">
                                                          <tbody style="
                                                                box-sizing: border-box;
                                                                font-family: -apple-system,
                                                                  BlinkMacSystemFont,
                                                                  'Segoe UI',
                                                                  Helvetica,
                                                                  Arial,
                                                                  sans-serif,
                                                                  'Apple Color Emoji',
                                                                  'Segoe UI Emoji' !important;
                                                              ">
                                                            <tr style="
                                                                  box-sizing: border-box;
                                                                  font-family: -apple-system,
                                                                    BlinkMacSystemFont,
                                                                    'Segoe UI',
                                                                    Helvetica,
                                                                    Arial,
                                                                    sans-serif,
                                                                    'Apple Color Emoji',
                                                                    'Segoe UI Emoji' !important;
                                                                ">
                                                              <td height="16" style="
                                                                    font-size: 16px;
                                                                    line-height: 16px;
                                                                    box-sizing: border-box;
                                                                    font-family: -apple-system,
                                                                      BlinkMacSystemFont,
                                                                      'Segoe UI',
                                                                      Helvetica,
                                                                      Arial,
                                                                      sans-serif,
                                                                      'Apple Color Emoji',
                                                                      'Segoe UI Emoji' !important;
                                                                    padding: 0;
                                                                  ">
                                                                &nbsp;
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>

                                                        <table border="0" cellspacing="0" cellpadding="0" align="center"
                                                          width="100%" style="
                                                              box-sizing: border-box;
                                                              border-spacing: 0;
                                                              border-collapse: collapse;
                                                              width: 100% !important;
                                                              font-family: -apple-system,
                                                                BlinkMacSystemFont,
                                                                'Segoe UI',
                                                                Helvetica, Arial,
                                                                sans-serif,
                                                                'Apple Color Emoji',
                                                                'Segoe UI Emoji' !important;
                                                            ">
                                                          <tbody>
                                                            <tr style="
                                                                  box-sizing: border-box;
                                                                  font-family: -apple-system,
                                                                    BlinkMacSystemFont,
                                                                    'Segoe UI',
                                                                    Helvetica,
                                                                    Arial,
                                                                    sans-serif,
                                                                    'Apple Color Emoji',
                                                                    'Segoe UI Emoji' !important;
                                                                ">
                                                              <td align="center" style="
                                                                    box-sizing: border-box;
                                                                    font-family: -apple-system,
                                                                      BlinkMacSystemFont,
                                                                      'Segoe UI',
                                                                      Helvetica,
                                                                      Arial,
                                                                      sans-serif,
                                                                      'Apple Color Emoji',
                                                                      'Segoe UI Emoji' !important;
                                                                    padding: 0;
                                                                  ">
                                                                <table width="100%" border="0" cellspacing="0"
                                                                  cellpadding="0" style="
                                                                      box-sizing: border-box;
                                                                      border-spacing: 0;
                                                                      border-collapse: collapse;
                                                                      font-family: -apple-system,
                                                                        BlinkMacSystemFont,
                                                                        'Segoe UI',
                                                                        Helvetica,
                                                                        Arial,
                                                                        sans-serif,
                                                                        'Apple Color Emoji',
                                                                        'Segoe UI Emoji' !important;
                                                                    ">
                                                                  <tbody>
                                                                    <tr style="
                                                                          box-sizing: border-box;
                                                                          font-family: -apple-system,
                                                                            BlinkMacSystemFont,
                                                                            'Segoe UI',
                                                                            Helvetica,
                                                                            Arial,
                                                                            sans-serif,
                                                                            'Apple Color Emoji',
                                                                            'Segoe UI Emoji' !important;
                                                                        ">
                                                                      <td style="
                                                                            box-sizing: border-box;
                                                                            font-family: -apple-system,
                                                                              BlinkMacSystemFont,
                                                                              'Segoe UI',
                                                                              Helvetica,
                                                                              Arial,
                                                                              sans-serif,
                                                                              'Apple Color Emoji',
                                                                              'Segoe UI Emoji' !important;
                                                                            padding: 0;
                                                                          ">
                                                                        <table border="0" cellspacing="0"
                                                                          cellpadding="0" width="100%" style="
                                                                              box-sizing: border-box;
                                                                              border-spacing: 0;
                                                                              border-collapse: collapse;
                                                                              font-family: -apple-system,
                                                                                BlinkMacSystemFont,
                                                                                'Segoe UI',
                                                                                Helvetica,
                                                                                Arial,
                                                                                sans-serif,
                                                                                'Apple Color Emoji',
                                                                                'Segoe UI Emoji' !important;
                                                                            ">
                                                                          <tbody>
                                                                            <tr style="
                                                                                  box-sizing: border-box;
                                                                                  font-family: -apple-system,
                                                                                    BlinkMacSystemFont,
                                                                                    'Segoe UI',
                                                                                    Helvetica,
                                                                                    Arial,
                                                                                    sans-serif,
                                                                                    'Apple Color Emoji',
                                                                                    'Segoe UI Emoji' !important;
                                                                                ">
                                                                              <td align="center" style="
                                                                                    box-sizing: border-box;
                                                                                    font-family: -apple-system,
                                                                                      BlinkMacSystemFont,
                                                                                      'Segoe UI',
                                                                                      Helvetica,
                                                                                      Arial,
                                                                                      sans-serif,
                                                                                      'Apple Color Emoji',
                                                                                      'Segoe UI Emoji' !important;
                                                                                    padding: 0;
                                                                                  ">
                                                                                <a href="https://42manito.com/reservations/${reservationId}"
                                                                                  rel="noopener noreferrer" style="
                                                                                      background-color: #1f883d !important;
                                                                                      box-sizing: border-box;
                                                                                      color: #fff;
                                                                                      text-decoration: none;
                                                                                      display: inline-block;
                                                                                      font-size: inherit;
                                                                                      font-weight: 500;
                                                                                      line-height: 1.5;
                                                                                      white-space: nowrap;
                                                                                      vertical-align: middle;
                                                                                      border-radius: 0.5em;
                                                                                      font-family: -apple-system,
                                                                                        BlinkMacSystemFont,
                                                                                        'Segoe UI',
                                                                                        Helvetica,
                                                                                        Arial,
                                                                                        sans-serif,
                                                                                        'Apple Color Emoji',
                                                                                        'Segoe UI Emoji' !important;
                                                                                      padding: 0.75em
                                                                                        1.5em;
                                                                                      border: 1px
                                                                                        solid
                                                                                        #1f883d;
                                                                                    " target="_blank"
                                                                                  data-saferedirecturl="https://42manito.com/reservations/${reservationId}">
                                                                                  예약 보러가기</a>

                                                                              </td>
                                                                            </tr>
                                                                          </tbody>
                                                                        </table>
                                                                      </td>
                                                                    </tr>
                                                                  </tbody>
                                                                </table>
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                        <table style="
                                                              box-sizing: border-box;
                                                              border-spacing: 0;
                                                              border-collapse: collapse;
                                                              font-family: -apple-system,
                                                                BlinkMacSystemFont,
                                                                'Segoe UI',
                                                                Helvetica, Arial,
                                                                sans-serif,
                                                                'Apple Color Emoji',
                                                                'Segoe UI Emoji' !important;
                                                            ">
                                                          <tbody style="
                                                                box-sizing: border-box;
                                                                font-family: -apple-system,
                                                                  BlinkMacSystemFont,
                                                                  'Segoe UI',
                                                                  Helvetica,
                                                                  Arial,
                                                                  sans-serif,
                                                                  'Apple Color Emoji',
                                                                  'Segoe UI Emoji' !important;
                                                              ">
                                                            <tr style="
                                                                  box-sizing: border-box;
                                                                  font-family: -apple-system,
                                                                    BlinkMacSystemFont,
                                                                    'Segoe UI',
                                                                    Helvetica,
                                                                    Arial,
                                                                    sans-serif,
                                                                    'Apple Color Emoji',
                                                                    'Segoe UI Emoji' !important;
                                                                ">
                                                              <td height="32" style="
                                                                    font-size: 32px;
                                                                    line-height: 32px;
                                                                    box-sizing: border-box;
                                                                    font-family: -apple-system,
                                                                      BlinkMacSystemFont,
                                                                      'Segoe UI',
                                                                      Helvetica,
                                                                      Arial,
                                                                      sans-serif,
                                                                      'Apple Color Emoji',
                                                                      'Segoe UI Emoji' !important;
                                                                    padding: 0;
                                                                  ">
                                                                &nbsp;
                                                              </td>
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="
                      box-sizing: border-box;
                      border-spacing: 0;
                      border-collapse: collapse;
                      width: 100% !important;
                      text-align: center !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji' !important;
                    ">
                  <tbody>
                    <tr style="
                          box-sizing: border-box;
                          font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Helvetica, Arial, sans-serif,
                            'Apple Color Emoji', 'Segoe UI Emoji' !important;
                        ">
                      <td align="center" style="
                            box-sizing: border-box;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            padding: 0;
                          ">
                        <table style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              ">
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td height="16" style="
                                    font-size: 16px;
                                    line-height: 16px;
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <table style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              ">
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td height="16" style="
                                    font-size: 16px;
                                    line-height: 16px;
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table border="0" cellspacing="0" cellpadding="0" align="center" width="100%" style="
                      box-sizing: border-box;
                      border-spacing: 0;
                      border-collapse: collapse;
                      width: 100% !important;
                      text-align: center !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                        Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                        'Segoe UI Emoji' !important;
                    ">
                  <tbody>
                    <tr style="
                          box-sizing: border-box;
                          font-family: -apple-system, BlinkMacSystemFont,
                            'Segoe UI', Helvetica, Arial, sans-serif,
                            'Apple Color Emoji', 'Segoe UI Emoji' !important;
                        ">
                      <td align="center" style="
                            box-sizing: border-box;
                            font-family: -apple-system, BlinkMacSystemFont,
                              'Segoe UI', Helvetica, Arial, sans-serif,
                              'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            padding: 0;
                          ">
                        <table style="
                              box-sizing: border-box;
                              border-spacing: 0;
                              border-collapse: collapse;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          <tbody style="
                                box-sizing: border-box;
                                font-family: -apple-system, BlinkMacSystemFont,
                                  'Segoe UI', Helvetica, Arial, sans-serif,
                                  'Apple Color Emoji', 'Segoe UI Emoji' !important;
                              ">
                            <tr style="
                                  box-sizing: border-box;
                                  font-family: -apple-system, BlinkMacSystemFont,
                                    'Segoe UI', Helvetica, Arial, sans-serif,
                                    'Apple Color Emoji', 'Segoe UI Emoji' !important;
                                ">
                              <td height="16" style="
                                    font-size: 16px;
                                    line-height: 16px;
                                    box-sizing: border-box;
                                    font-family: -apple-system,
                                      BlinkMacSystemFont, 'Segoe UI', Helvetica,
                                      Arial, sans-serif, 'Apple Color Emoji',
                                      'Segoe UI Emoji' !important;
                                    padding: 0;
                                  ">
                                &nbsp;
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p style="
                              box-sizing: border-box;
                              margin-top: 0;
                              margin-bottom: 10px;
                              color: #6a737d !important;
                              font-size: 12px !important;
                              font-family: -apple-system, BlinkMacSystemFont,
                                'Segoe UI', Helvetica, Arial, sans-serif,
                                'Apple Color Emoji', 'Segoe UI Emoji' !important;
                            ">
                          서울시 강남구 개포로 416 새롬관
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </center>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="yj6qo"></div>
      <div class="adL"></div>
      <div style="
            display: none;
            white-space: nowrap;
            box-sizing: border-box;
            font: 15px/0 apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
              Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
          " class="adL">
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      </div>
      <div class="adL"></div>
    </div>
    <div class="adL"></div>
  </div>
</div>
`;
