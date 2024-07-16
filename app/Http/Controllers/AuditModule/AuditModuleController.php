<?php
                    namespace App\Http\Controllers\NameOfFolder;
                    use App\Helpers\CommonHelpers;
                    use App\Http\Controllers\Controller;
                    use Illuminate\Http\Request;
                    use Illuminate\Http\RedirectResponse;
                    use Illuminate\Support\Facades\Auth;
                    use Illuminate\Support\Facades\Session;
                    use Inertia\Inertia;
                    use Inertia\Response;
                    use DB;
                class AuditModuleController extends Controller{
                    public function getIndex(){
                        return Inirtia("audit-module/audit-module-Controller");
                    }
                }
                ?>